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
        const res = await _DB.consultationCheck(visitorId);
        if (res == true || res == false)
            return !res;
        else return null;
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
// 
const unlinkMedecinFromRooms = async clientId => {
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
async function getNotificationFullData(visitorId) {
    try {
        let visitorData = await _DB.getAllData('visitor', `WHERE visitorId = '${visitorId}'`);
        if (visitorData != null) {
            visitorData = visitorData[0];
            let insertedNotificationData = await _DB.getLastInsertedPrecons(visitorId);
            if (insertedNotificationData != null) {
                let docs = await _DB.getAllData('attachment', `WHERE preConsId = '${insertedNotificationData.preConsId}'`);
                if (docs != null) {
                    for (let i = 0; i < docs.length; i++) {
                        docs[i] = {
                            id: i,
                            name: docs[i].attachmentName,
                            link: `/files/${visitorId}/${docs[i].attachmentName}`
                        }
                    }
                } else docs = [];
                return {
                    index: insertedNotificationData.preConsId,
                    name: visitorData.visitorName,
                    date: insertedNotificationData.preConsDateCreation,
                    TZ: insertedNotificationData.preConsDateTimeZone,
                    matricule: visitorId,
                    tel: visitorData.visitorTel,
                    title: insertedNotificationData.preConsTitle,
                    desc: insertedNotificationData.preConsDesc,
                    files: docs,
                    visitorId: visitorData.visitorId
                }
            } else throw `LAST INSERTED Notification not found`;
        } else throw `Visitor Not found`;
    } catch (err) {
        console.log(err);
        return null;
    }
}
// 
const getClientNotifications = async clientId => {
    try {
        let notifications = await _DB.getClientPrecons(clientId);
        let fullNotifications = [];
        if (notifications != null) {
            for (const notif of notifications) {
                const notifFullData = await getNotificationFullData(notif.visitorId);
                if (notifFullData != null)
                    fullNotifications.push(notifFullData);
            }
        }
        // 
        return fullNotifications;
    } catch (err) {
        console.error(err);
        return null;
    }
}
// 
const getConsultations = async clientId => {
    try {
        const consultations = await _DB.getClientConsultations(clientId);
        if (consultations != null) {
            for (let i = 0; i < consultations.length; i++) {
                const docs = await _DB.getAllData('attachment', `WHERE preConsId = '${consultations[i].preConsId}'`);
                consultations[i].docs = docs != null ? docs : [];
            }
            // 
            return consultations;
        }
        // throw `Nothing was found`
        return [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
// 
const getConsultation = async notifId => {
    try {
        let consultation = await _DB.getConsultation(notifId);
        if (consultation != null) {
            const docs = await _DB.getAllData('attachment', `WHERE preConsId = '${consultation.preConsId}'`);
            consultation.docs = docs != null ? docs : [];
            return consultation;
        }
        throw `Consultation not found`;
    } catch (err) {
        console.error(err);
        return null;
    }
}
// 
const getRefusedPrecons = async notifId => {
    try {
        let consultation = await _DB.getAllData('preConsultation', `WHERE preConsId = '${notifId}'`);
        if (consultation != null) {
            consultation = consultation[0];
            const docs = await _DB.getAllData('attachment', `WHERE preConsId = '${consultation.preConsId}'`);
            consultation.docs = docs != null ? docs : [];
            return consultation;
        }
        throw `Consultation not found`;
    } catch (err) {
        console.error(err);
        return null;
    }
}
// 
const visitorCurrentConsultation = async visitorId => {
    try {
        let notifData = await _DB.getAllData('preConsultation', `WHERE visitorId = '${visitorId}' AND preConsAccepted = 1 AND preConsId IN (SELECT preConsId FROM consultation WHERE consulState = -1)`);
        if (notifData != null) {
            notifData = notifData[0];
            return await getConsultation(notifData.preConsId);
        }
        throw `NOTIFICATION NOT FOUND`;

    } catch (err) {
        console.error(err);
        return null;
    }
}
// 
const cancelPrecons = async visitorId => {
    try {
        // CHECK IF VISITOR CAN CANCEL // IF YES RETURN NOTIFICATION DATA
        let notifData = await _DB.getAllData('preConsultation', `WHERE visitorId = '${visitorId}' AND preConsAccepted = -1`);
        if (notifData != null) {
            notifData = notifData[0];
            // 
            const deleteRes = await _DB.customDataDelete({
                table: 'preConsultation',
                id: 'preConsId'
            }, notifData.preConsId);
            // 
            if (deleteRes > 0) {
                const preConsFiles = await _DB.getAllData('attachment', `WHERE preConsId = '${notifData.preConsId}'`);
                if (preConsFiles != null) {
                    const {
                        removeFile
                    } = require('./fs');
                    // 
                    for (const doc of preConsFiles) {
                        await removeFile(doc.attachmentId, doc.attachmentName, visitorId);
                    }
                }
                return status(true, notifData.preConsId);
            }
            // 
            throw `Demande non supprimer merci de rafraichir la page et réessayer.`;
        }
        throw `Votre demande de consultation a été déja acceptée ou bien est deja suprimée.`;
    } catch (err) {
        console.error(visitorId, err);
        return status(false, err);
    }
}
// 
const clientDataFromVisitor = async visitorId => {
    try {
        return await _DB.getAllData('appUser', `WHERE userId IN (SELECT linkToClient FROM appUser WHERE userId = '${visitorId}')`);
    } catch (err) {
        console.error(err);
        return null;
    }
}
// 
const getVisitorConsultations = async visitorId => {
    try {
        const consultations = await _DB.getVisitorConsHistory(visitorId);
        if (consultations != null) {
            for (let i = 0; i < consultations.length; i++) {
                const docs = await _DB.getAllData('attachment', `WHERE preConsId = '${consultations[i].preConsId}'`);
                consultations[i].docs = docs != null ? docs : [];
            }
            // 
            return consultations;
        }
        // throw `Nothing was found`
        return [];

    } catch (err) {
        console.error(err);
        return [];
    }
}
// 
const getPreconsForCurrentUser = async (userId, userType) => {
    try {
        let visitorId = userId;
        if (userType != 'Visitor') {
            const roomData = await _DB.getAllData('room', `WHERE roomClientId = '${userId}'`);
            if (roomData != null)
                visitorId = roomData[0].roomVisitorId;
            else throw `Room not found for Client : ${userId}`;
        }
        // 
        const notifData = await _DB.getAllData('preConsultation', `WHERE visitorId = '${visitorId}' AND preConsAccepted = 1 AND preConsId IN (SELECT preConsId FROM consultation WHERE consulState = -1)`);
        if (notifData != null)
            return notifData[0].preConsId;
        else throw `Consultation not found for visitor : ${visitorId}`;

    } catch (err) {
        console.error(err);
        return null;
    }
}
// 
const sendAndGetMessage = async msgClassObject => {
    try {
        const msgRes = await _DB.insertDataWithResponse(msgClassObject);
        if (msgRes != null) {
            const msgData = await _DB.getAllData('message', `WHERE msgId = '${msgRes}'`);
            if (msgData != null)
                return msgData[0];
            throw `Message not found`;
        }
        throw `Message not inserted`;
    } catch (err) {
        console.error(err);
        return null;
    }
}
// 
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
    canSendPrecons,
    getClientNotifications,
    getConsultations,
    getConsultation,
    visitorCurrentConsultation,
    cancelPrecons,
    clientDataFromVisitor,
    getRefusedPrecons,
    getVisitorConsultations,
    getPreconsForCurrentUser,
    sendAndGetMessage
}