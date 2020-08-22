const _DB = require('../model/dbQuery');
const _CLASSES = require('../model/classes');

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
const response = (res, responseCode, data = 'null') => {
    switch (responseCode) {
        case 200:
            res.status(responseCode).json(data);
            break;
        default:
            res.status(responseCode).end(JSON.stringify(data));
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
    //
    const recordsCount = await _DB.getRecordsLength(userTable);
    if (recordsCount != null) {
        return `${userTable == 'client' ? 'CL' : 'VS'}${recordsCount}`;
    }
    // else return null
}
// 
const userExists = async (email) => {
    //
    const checkRes = await _DB.checkEmail(email);
    if (checkRes != null) {
        return checkRes == 0 ? false : true;
    }
    // else return null
}
// 
const refCodeExists = async (refCode) => {
    //
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
        //
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
        //
        //
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
const canSendPrecons = async visitorId => {
    try {
        return !(await _DB.consultationCheck(visitorId));
    } catch (err) {
        console.error(err);
        return null;
    }
}
// 
const preConsAccepted = async notifId => {
    try {
        const queryRes = await _DB.getAllData('preConsultation', `WHERE preConsId = '${notifId}' AND preConsAccepted = -1`);
        return queryRes == null ? false : true;
    } catch (err) {
        console.error(err);
        return null;
    }
}
// 
const acceptPrecons = async data => {
    try {
        //
        //
        let errMsg = '';
        // 
        const conInsertRes = await _DB.insertData(new _CLASSES.consultation(data.conJR, data.conDate, data.userTZ, data.conCmnt, data.clientId, data.preConsId));
        if (conInsertRes > 0) {
            // UPDATE PRECONSULTATION STATUS
            const updatePrecons = await _DB.customDataUpdate({
                preConsAccepted: 1
            }, data.preConsId, {
                table: 'preConsultation',
                id: 'preConsId'
            });
            // 
            if (updatePrecons) {
                // UNLINK CLIENT FROM OTHER ROOMS
                const unlinkRes = await unlinkMedecinFromRooms(data.clientId);
                // if (unlinkRes) {
                const roomRes = await _DB.getRoomByNotifId(data.preConsId);
                if (roomRes != null) {
                    const roomUpdateRes = await _DB.customDataUpdate({
                        roomClientId: data.clientId
                    }, roomRes.roomId, {
                        table: 'room',
                        id: 'roomId'
                    });
                    if (roomUpdateRes) return true;
                    else errMsg = `room not updated`;
                } else `Room not found`;
                // } else errMsg = `Unlinking failed`;
                await _DB.customDataUpdate({
                    preConsAccepted: -1
                }, data.preConsId, {
                    table: 'preConsultation',
                    id: 'preConsId'
                });
            } else errMsg = `preconsultation not updated`;
            await _DB.customDataDelete({
                table: 'consultation',
                id: 'preConsId'
            }, data.preConsId);
        } else errMsg = 'Consultation not inserted';
        throw errMsg;
    } catch (err) {
        console.error(err);
        return null;
    }
}
async function unlinkMedecinFromRooms(clientId) {
    try {
        return await _DB.customDataUpdate({
            roomClientId: null
        }, clientId, {
            table: "room",
            id: "roomClientId"
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}

// 
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
    saveAndGetPrecons,
    preConsAccepted,
    acceptPrecons,
    canSendPrecons
}