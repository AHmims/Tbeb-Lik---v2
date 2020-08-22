const __FSE = require('fs-extra');
const __PATH = require('path');
// 
const _CLASSES = require('../model/classes');
const _DB = require('../model/dbQuery');
const {
    getUtc: _GET_UTC
} = require('../helper/date');


// 
module.exports = {
    commonFileValidator: (file) => {
        if (file != null && file != undefined) {
            const types = [".png", ".jpg", ".jpeg", ".jfif", ".gif", ".pdf", ".doc", ".docs"];
            const maxFileSize = 10000000; //10mb
            // 
            const _FILE_NAME = file.name;
            const _FILE_EXTENSION = _FILE_NAME.substr(_FILE_NAME.lastIndexOf("."), _FILE_NAME.length);
            // 
            let supportedExtension = types.includes(_FILE_EXTENSION);
            if (supportedExtension) {
                if (file.size <= maxFileSize)
                    return true;
                return `la taille de ${_FILE_NAME} à dépasse 10mb.`;
            }
            return `L'extension de ${_FILE_NAME} n'est pas supporté.`;
        }
        return `Fichier non trouvée.`;
    },
    commonFileSaver: async (file, userId, timeZone) => {
        let retData = null;
        const _FILE_NAME = file.name;
        const _FILE_EXTENSION = _FILE_NAME.substr(_FILE_NAME.lastIndexOf("."), _FILE_NAME.length);
        const _FILE_PATH = __PATH.resolve(__dirname + `/../files/${userId}`);
        // 
        let saveDate = new Date();
        saveDate = {
            d: saveDate.getDate(),
            m: saveDate.getMonth() + 1
        }
        const _FILE_NAME_EXPORT = `${saveDate.m}${saveDate.d}_${Math.floor((Math.random() * 1000000) + 1)}${_FILE_EXTENSION}`;
        try {
            let insertRes = await _DB.insertDataWithResponse(new _CLASSES.attachment(_FILE_NAME_EXPORT, userId, _GET_UTC(), timeZone, 'preCons'));
            // 
            if (insertRes != null) {
                await __FSE.ensureDir(_FILE_PATH);
                await __FSE.copyFile(file.path, __PATH.join(_FILE_PATH, _FILE_NAME_EXPORT));
                // 
                return {
                    docId: insertRes,
                    docName: _FILE_NAME_EXPORT
                };
            } else retData = 0; // `Erreur de server, veuillez réessayer plus tard.`;
            // 
        } catch (err) {
            console.log(err);
            retData = 1; //`Erreur de server, veuillez réessayer plus tard.`;
        }
        return retData;
    },
    removeFile: async (fileId, fileName, userId) => {
        try {
            const docDeleteRes = await _DB.customDataDelete({
                table: 'attachment',
                id: 'attachmentId'
            }, fileId);
            if (docDeleteRes > 0) {
                await __FSE.remove(__PATH.resolve(__dirname + `/../files/${userId}/${fileName}`));
                return true;
            }
            throw 'Attachment not deleted';
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}