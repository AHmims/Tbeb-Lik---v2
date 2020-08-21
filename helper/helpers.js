const status = (status, data) => {
    return {
        status: status,
        data: data
    }
}
// 
/*OK: 200,
BAD_REQUEST: 400,
UNAUTHORIZED: 401,
FORBIDDEN: 403,
NOT_FOUND: 404,
UNSUPPORTED_ACTION: 405,
VALIDATION_FAILED: 422,
SERVER_ERROR: 500
*/
const response = (res, responseCode, data = null) => {
    switch (responseCode) {
        case 200:
            res.status(responseCode).json(data);
            break;
        default:
            res.status(responseCode).end(data);
    }
}
// TRIM REQ BODY DATA
const reqBodyTrim = (bodyObject) => {
    for (const key in bodyObject) {
        if (bodyObject.hasOwnProperty(key)) {
            const keyValue = bodyObject[key];
            if (!key.toLowerCase().includes("file")) {
                if (Array.isArray(keyValue)) {
                    for (let i = 0; i < keyValue.length; i++) {
                        bodyObject[key][i] = keyValue[i].trim();
                    }
                } else bodyObject[key] = keyValue.trim();
            }
        }
    }
    return bodyObject;
}
// GENERATE USER ID
const userId = async (userTable) => {
    const _DB = require('../model/dbQuery');
    const recordsCount = await _DB.getRecordsLength(userTable);
    if (recordsCount != null) {
        return `${userTable == 'client' ? 'CL' : 'VS'}${recordsCount}`;
    }
    // else return null
}
// 
const userExists = async (email) => {
    const _DB = require('../model/dbQuery');
    const checkRes = await _DB.checkEmail(email);
    if (checkRes != null) {
        return checkRes == 0 ? false : true;
    }
    // else return null
}
// 
const refCodeExists = async (refCode) => {
    const _DB = require('../model/dbQuery');
    const checkRes = await _DB.checkRefcode(refCode);
    // MAYBE I'LL DO SOMEFUTURE WORK HERE
    // SUCH AS THE CODE TO BE A LINK AND DECONSTRUCT IT HERE
    return checkRes; // RETURN clientId & companyId LINKED TO THAT CODE IF EXISTS || ELSE RETURN NULL
}
// 
const genRefCode = () => {
    const refCodeGen = require('referral-code-generator');
    return refCodeGen.alphaNumeric('uppercase', 12, 1);
}
// 
const getRefCode = async (clientId, fields = 'code') => {
    try {
        const _DB = require('../model/dbQuery');
        const refCodeRes = (await _DB.getAllData('referral', `WHERE clientId = '${clientId}'`))[0];
        if (refCodeRes != null)
            return fields != 'all' ? refCodeRes.refCode : refCodeRes;
        return null;
    } catch (err) {
        console.err(err);
        return null;
    }
}
// 
const saveAndGetPrecons = async (visitorId, formData) => {
    try {
        const _DB = require('../model/dbQuery');
        const _CLASSES = require('../model/classes');
        const {
            getUtc: _GET_UTC
        } = require('../helper/date');
        //
        const insertRes = await _DB.insertData(new _CLASSES.preConsultation('TempId', _GET_UTC(), formData.conTZ, formData.conTitle, formData.conDesc, -1, visitorId));
        if (insertRes > 0)
            return await _DB.visitorLastPrecons(visitorId);
        throw 'Precons not saved';
    } catch (err) {
        console.error(err);
        return null;
    }
}
// 
module.exports = {
    status,
    response,
    reqBodyTrim,
    userId,
    userExists,
    refCodeExists,
    genRefCode,
    getRefCode,
    saveAndGetPrecons
}