const express = require('express');
const router = express.Router();
const formData = require('express-form-data');
const __PATH = require('path');
// 
const options = {
    uploadDir: __PATH.resolve(__dirname + '/../filesTmp'),
    autoClean: true
};
const {
    response,
    status,
    reqBodyTrim: _TRIM,
    saveAndGetPrecons
} = require('../helper/helpers');
const {
    commonFileValidator,
    commonFileSaver,
    removeFile
} = require('../helper/fs');
// 
router.use(require('../config/auth').isAuth_api);
// 
router.post('/savePrecons', formData.parse(options), async (req, res) => {
    try {
        let erros = [];
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
                if (Object.keys(req.files).length > 0) {
                    let conDocsData = [];
                    let docSavingError = false;
                    // 
                    for (const conFile of req.files.conFile) {
                        const savingRes = await commonFileSaver(conFile, req.user.userId, conTZ);
                        if (typeof savingRes === 'object') {
                            conDocsData.push(savingRes); // .docId & docName
                        } else {
                            docSavingError = true;
                            console.log(`api.js | Doc saving error | errorCode => ${savingRes}`);
                        }
                    }
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
                            // 
                            response(res, 200, status('sucess', preConsInsertRes));
                        }
                    }
                    erros.push(`Erreur de server`);
                    // CLEAR DOCUMENTS
                    for (const docData of conDocsData) {
                        await removeFile(docData.docId, docData.docName);
                    }
                }
            }
        }
        response(res, 422, status('error', erros));

    } catch (err) {
        console.error(err);
        response(res, 500);
    }
    // console.log(req.body);
    // res.json(req.body);
    // res.status(500).end();
});
// 

module.exports = router;