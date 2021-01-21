const express = require('express');
const router = express.Router();
const formData = require('express-form-data');
const __PATH = require('path');
// 
const _CLASSES = require('../model/classes');
const _DB = require('../model/dbQuery');
// 
const options = {
    uploadDir: __PATH.resolve(__dirname + '/../filesTmp'),
    autoClean: true
};
const {
    response,
    status,
    reqBodyTrim: _TRIM,
    saveAndGetPrecons,
    preConsAccepted,
    acceptPrecons,
    canSendPrecons,
    getConsultation,
    cancelPrecons,
    getRefusedPrecons,
    getPreconsForCurrentUser,
    sendAndGetMessage
} = require('../helper/helpers');
const {
    commonFileValidator,
    commonFileSaver,
    removeFile
} = require('../helper/fs');
const {
    getUtc
} = require('../helper/date');
// 
router.use(require('../config/auth').isAuth_api);
// SEND NOTIFICATION
router.post('/savePrecons', formData.parse(options), async (req, res) => {
    try {
        if (req.user.userType == 'Visitor') {
            let erros = [];
            // 
            const canSendCheck = await canSendPrecons(req.user.userId);
            // 
            if (canSendCheck == true || canSendCheck == null) {
                const {
                    conTitle,
                    conDesc,
                    conTZ
                } = _TRIM(req.body);
                // 
                if (conTitle.length == 0) erros.push('Titre invalide');
                if (conDesc.length == 0) erros.push('Description invalide');
                // 
                if (erros.length == 0) {
                    if (Object.keys(req.files).length > 0) {
                        if (!Array.isArray(req.files.conFile))
                            req.files.conFile = [req.files.conFile];
                    } else {
                        req.files = {
                            conFile: []
                        };
                    }
                    // FILES VALIDATION
                    for (const conFile of req.files.conFile) {
                        const validationRes = commonFileValidator(conFile);
                        if (validationRes != true)
                            erros.push(validationRes);
                    }
                    // no errors
                    // GO NEXT
                    if (erros.length == 0) {
                        // CHECK IF USER SENT ANY FILES
                        // if (Object.keys(req.files).length > 0) {
                        let conDocsData = [];
                        let docSavingError = false;
                        // 
                        // console.log(req.files.conFile);
                        for (const conFile of req.files.conFile) {
                            const savingRes = await commonFileSaver(conFile, req.user.userId, conTZ);
                            // console.log(savingRes);
                            if (typeof savingRes === 'object') {
                                conDocsData.push(savingRes); // .docId & docName
                            } else {
                                docSavingError = true;
                                console.log(`api.js | Doc saving error | errorCode => ${savingRes}`);
                            }
                        }
                        // console.log(conDocsData);
                        // 
                        if (!docSavingError) {
                            // SAVE PRECONS
                            const preConsInsertRes = await saveAndGetPrecons(req.user.userId, {
                                conTitle,
                                conDesc,
                                conTZ
                            });
                            // 
                            if (preConsInsertRes != null) {
                                // UPDATE SAVED FILES WITH PRECONS ID
                                for (const docData of conDocsData) {
                                    await _DB.customDataUpdate({
                                        preConsId: preConsInsertRes.preConsId
                                    }, docData.docId, {
                                        table: 'attachment',
                                        id: 'attachmentId'
                                    });
                                }
                                // 
                                let docsUrls = [];
                                for (const docData of conDocsData) {
                                    docsUrls.push({
                                        name: docData.docName,
                                        url: `/files/${req.user.userId}/${docData.docName}`
                                    });
                                }
                                preConsInsertRes.docs = docsUrls;
                                // 
                                let visitorData = await _DB.getAllData('visitor', `WHERE visitorId = '${req.user.userId}'`);
                                visitorData = visitorData[0];
                                preConsInsertRes.name = visitorData.visitorName;
                                preConsInsertRes.tel = visitorData.visitorTel;
                                preConsInsertRes.visitorId = visitorData.visitorId;
                                const {
                                    fromUtcToTimeZone
                                } = require('../helper/date');
                                preConsInsertRes.preConsDateCreation = fromUtcToTimeZone(preConsInsertRes.preConsDateTimeZone, preConsInsertRes.preConsDateCreation);
                                // 
                                response(res, 200, status('success', preConsInsertRes));
                            }
                        }
                        erros.push(`Erreur de server`);
                        if (docSavingError) {
                            // CLEAR DOCUMENTS
                            for (const docData of conDocsData) {
                                await removeFile(docData.docId, docData.docName, req.user.userId);
                            }
                        }
                        // }
                    }
                }
            } else erros.push(`Vous avez déjà une demande en cours de traitement.`)
            response(res, 422, status('error', erros));
        } else response(res, 401);
    } catch (err) {
        console.error(err);
        response(res, 500);
    }
});
// ACCEPT NOTIFICATION
router.post('/acceptPrecons', async (req, res) => {
    try {
        // console.log(req.user);
        // console.log(req.body);
        if (req.user.userType != 'Visitor') {
            let errorMsg = '';
            // CHECK IF TEH SAID REQUEST IS ACCEPTED OR NOT
            // console.log(req.body);
            const preConsStatus = await preConsAccepted(req.body.preConsId); // return true = not accepted || false = accepted || null = server error
            if (preConsStatus == true) {
                const {
                    preConsId,
                    conDate,
                    conCmnt,
                    userTZ
                } = _TRIM(req.body);
                // 
                if (conDate != '') {
                    // 
                    const acceptRes = await acceptPrecons({
                        preConsId,
                        conDate,
                        conCmnt,
                        userTZ,
                        conJR: -1,
                        clientId: req.user.userId
                    });
                    if (acceptRes == true)
                        response(res, 200, status('success', {
                            preConsId,
                            data: await getConsultation(preConsId)
                        }));
                    errorMsg = `Erreur lors de l'exécution de votre demande`;
                    // 
                    // console.log(acceptRes);
                } else errorMsg = `Champ date ne peut pas etre vide`;
            } else
                errorMsg = preConsStatus == null ? `Erreur de serveur.` : `Votre demande de consultation est deja acceptée.`;
            // 
            response(res, 422, errorMsg);
        } else response(res, 401);
    } catch (err) {
        console.error(err);
        response(res, 500);
    }
});
// REFUSE NOTIFICATION
router.post('/refusePrecons', async (req, res) => {
    try {
        if (req.user.userType != 'Visitor') {
            let errorMsg = '';
            // CHECK IF TEH SAID REQUEST IS ACCEPTED OR NOT
            const preConsStatus = await preConsAccepted(req.body.preConsId); // return true = not accepted || false = accepted || null = server error
            if (preConsStatus == true) {
                const {
                    preConsId
                } = req.body;
                // 
                // 
                const refuseRes = await _DB.customDataUpdate({
                    preConsAccepted: 0
                }, preConsId, {
                    table: 'preConsultation',
                    id: 'preConsId'
                })
                if (refuseRes == true)
                    response(res, 200, status('success', {
                        preConsId,
                        data: await getRefusedPrecons(preConsId)
                    }));
                errorMsg = `Erreur lors de l'exécution de votre demande`;
                // 
            } else
                errorMsg = preConsStatus == null ? `Erreur de serveur` : `Demande de consultation est deja acceptée.`;
            // 
            response(res, 422, errorMsg);
        } else response(res, 401);
    } catch (err) {
        console.error(err);
        response(res, 500);
    }
});
// CANCEL PRECONS
router.post('/cancelPrecons', async (req, res) => {
    try {
        if (req.user.userType == 'Visitor') {
            const cancelRes = await cancelPrecons(req.user.userId);
            if (cancelRes.status)
                response(res, 200, status(`success`, {
                    notifId: cancelRes.data,
                    userId: req.user.userId
                }));
            response(res, 422, status('error', cancelRes.data));
        } else response(res, 401);
    } catch (err) {
        console.error(err);
        response(res, 500);
    }
});
// NEW TEXT MESSAGE && REPORT
router.post('/newTextMessage', async (req, res) => {
    try {
        let errorMsg = '';
        // 
        const {
            msgContent,
            userTZ,
            preConsId
        } = _TRIM(req.body);
        // 
        const msg_type = req.body.msgType ? req.body.msgType : 'text';
        const msg_filePath = req.body.msgPath ? req.body.msgPath : null;
        // 
        if (msgContent.length <= 0) errorMsg = `Le message ne peut pas être vide`;
        if (errorMsg == '') {
            // const preCons = await getPreconsForCurrentUser(req.user.userId, req.user.userType); //USE THIS IF THE ABILITY TO SEND MESSAGES FROM PAST CONVERSATION IS GOING TO BE DISABLED
            const preCons = preConsId;
            if (preCons != null) {
                const msgRes = await sendAndGetMessage(new _CLASSES.message(req.user.userId, msgContent, getUtc(), userTZ, msg_type, msg_filePath, preCons));
                if (msgRes != null) {
                    response(res, 200, status('success', msgRes));
                } else errorMsg = `Erreur lors de l'enregistrement de votre message`;
            } else errorMsg = `Consultation introuvable`;
        }
        response(res, 422, status('error', errorMsg));
    } catch (err) {
        console.error(err);
        response(res, 500);
    }
});
// END CONSULTATION
router.post('/finalizeConsultation', async (req, res) => {
    try {
        if (req.user.userType != 'Visitor') {
            let error_msg = '';
            const {
                conComment,
                preConsId
            } = _TRIM(req.body);
            //CHECK IF CONSULTATIONS IS ALREADY CONCLUDED 
            const checkRes = await _DB.checkExistence({
                table: 'consultation',
                id: 'preConsId'
            }, preConsId, `AND consulState = -1`);
            if (checkRes) {
                // 
                const consCount = await _DB.getClientFinishedConsultationsCount(req.user.userId);
                if (consCount != null) {
                    // GENERATE PDF
                    const __PDF = require('../model/savePdf');
                    // 
                    const _consultation = await _DB.getAllData(`preConsultation`, `WHERE preConsId = '${preConsId}'`);
                    const _visitor = await _DB.getAllData('visitor', `WHERE visitorId = '${_consultation[0].visitorId}'`);
                    const _company = await _DB.getAllData('appCompany', `WHERE companyId IN (SELECT companyId FROM appUser WHERE userId = '${req.user.userId}')`);
                    // 
                    const reportGenRes = await __PDF.makeReport({
                        iteration: consCount,
                        client: req.user.userId,
                        comment: conComment,
                        consultation: _consultation[0],
                        visitor: _visitor[0],
                        client: {
                            id: req.user.userId,
                            name: req.user.userName,
                            email: req.user.userEmail
                        },
                        company: _company[0]
                    });
                    // 
                    if (reportGenRes.status) {
                        const updateRes = await _DB.customDataUpdate({
                            consulComment: conComment,
                            consulState: 1,
                            finalisationDate: getUtc(),
                            rapportLink: reportGenRes.downloadLink
                        }, preConsId, {
                            table: 'consultation',
                            id: 'preConsId'
                        });
                        // 
                        if (updateRes) {
                            // I COULD DELETE THE GENERATED REPORT, BUT
                            // IF UPDATE FAILED THEN THAT MEANS THE NEXT REPORT NAME WILL BE THE SAME
                            // AS THE PREVIOUS ONE, THERFOR THE FILE WILL BE OVERWRITEN \._./
                            // 
                            response(res, 200, status(`success`, reportGenRes.downloadLink));
                        } else error_msg = `Erreur lors de l'exécution de votre demande`; //`Consultation not updated`;
                    } else error_msg = `Erreur lors de la génération du rapport`;
                } else error_msg = `Erreur lors de l'exécution de votre demande`; //`Error while getting counsultations count`;
            } else error_msg = `Consultation déjà concluré`;
            response(res, 422, status('error', error_msg));
        } else response(res, 401);
    } catch (err) {
        console.error(err);
        response(res, 500);
    }
});

// 

module.exports = router;