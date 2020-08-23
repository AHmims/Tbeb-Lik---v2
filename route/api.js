const express = require('express');
const router = express.Router();
const formData = require('express-form-data');
const __PATH = require('path');
// 
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
    cancelPrecons
} = require('../helper/helpers');
const {
    commonFileValidator,
    commonFileSaver,
    removeFile
} = require('../helper/fs');
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
                    errorMsg = `Error while executing your request.`;
                    // 
                    // console.log(acceptRes);
                } else errorMsg = `Champ date ne peut pas etre vide`;
            } else
                errorMsg = preConsStatus == null ? `Server error.` : `Votre demande de consultation est deja acceptée.`;
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
            const cancelRes = await cancelPrecons(req.res.userId);
            if (cancelRes.status)
                response(res, 200, status(`success`, cancelRes.data));
            response(res, 422, status('error', cancelRes.data));
        } else response(res, 401);
    } catch (err) {
        console.error(err);
        response(res, 500);
    }
});
// 

module.exports = router;