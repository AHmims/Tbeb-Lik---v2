const db = require('./dbConfig');
const classes = require('./classes');
// 
// 
//#region 
// ONLY ACCEPT A CLASS AS INPUT
async function insertData(data) {
    let {
        tableName,
        fieldsNames,
        fieldsPlaceHolders,
        values
    } = getClassValues(data);
    try {
        let req = `INSERT INTO ${tableName}(${fieldsNames}) VALUES (${fieldsPlaceHolders})`,
            cnx = await db.connect(),
            res = await cnx.query(req, values);
        cnx.release();
        return res[0].affectedRows;
    } catch (err) {
        console.error('error :', err);
    }
}
// ADAPTED
async function getDataAll(className, constraint = '') {
    try {
        let req = `SELECT * FROM ${className} ${constraint}`,
            cnx = await db.connect(),
            res = await cnx.query(req);
        cnx.release();
        // 
        return res[0];
    } catch (err) {
        console.error('error :', err);
    }
}
// GET appUSER data by id
// ADAPTED
async function getAppUserDataById(id) {
    try {
        let req = `SELECT * FROM appUser where userId = ? LIMIT 1`,
            cnx = await db.connect(),
            res = await cnx.query(req, [id]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// GET WANTED DATA FROM appUser : keys = ["key1","key2"]
async function getAppUserCustomData(keys, id) {
    let slctdKeys = '';
    keys.forEach(key => {
        slctdKeys += `appUser.${key},`;
    });
    slctdKeys = removeLastChar(slctdKeys);

    try {
        let req = `SELECT ${slctdKeys} FROM appUser where userId = ? LIMIT 1`,
            cnx = await db.connect(),
            res = await cnx.query(req, [id]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// ADAPTED
async function getAppUserCustomDataBySocket(keys, socketId) {
    let slctdKeys = '';
    keys.forEach(key => {
        slctdKeys += `appUser.${key},`;
    });
    slctdKeys = removeLastChar(slctdKeys);

    try {
        let req = `SELECT ${slctdKeys} FROM appUser where appUser.socket = ? LIMIT 1`,
            cnx = await db.connect(),
            res = await cnx.query(req, [socketId]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// EXAMPLE OF KEY {online : false,socket : 'ssss'} | params = {table : "ss",id : "userId"}
// ADAPTED
async function customDataUpdate(keyANDvalue, id, params) {
    keyANDvalue = getObjectKeysWithValues(keyANDvalue);
    let strSection = '';
    keyANDvalue[0].forEach(key => {
        strSection += `${key} = ?,`
    });
    strSection = removeLastChar(strSection);
    keyANDvalue[1].push(id);
    // 
    // console.log(`UPDATE ${params.table} SET ${strSection} WHERE ${params.id} = ?`);
    // console.log(keyANDvalue[1]);
    // 
    try {
        let req = `UPDATE ${params.table} SET ${strSection} WHERE ${params.id} = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, keyANDvalue[1]);
        cnx.release();
        // 
        return res[0].affectedRows;
    } catch (err) {
        console.error('error :', err);
    }
}
// ADAPTED
async function getTypeById(id) {
    let type = 'null';
    try {
        let req = `SELECT count(*) as nb FROM patients where MATRICULE_PAT = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [id]);
        // 
        type = res[0][0].nb > 0 ? "Patient" : 'null';
        if (type == 'null') {
            req = `SELECT count(*) as nb FROM medecin where Matricule_Med = ?`;
            cnx = await db.connect();
            res = await cnx.query(req, [id]);
            // 
            if (res[0][0].nb > 0)
                type = "Medecin";
        }
        cnx.release();
        // 
        return type;
    } catch (err) {
        console.error('error :', err);
    }
}
// ADAPTED
async function getVilles() {
    try {
        let req = `SELECT distinct(VILLE) FROM medecin`,
            cnx = await db.connect(),
            res = await cnx.query(req);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0] : [];
    } catch (err) {
        console.error('error :', err);
    }
}
// ADAPTED
async function getOnlineMedecinsWithCityAndProffession(ville, idSpec) {
    try {
        let req = `select m.Matricule_Med,a.socket FROM medecin as m,appUser as a where m.ID_SPEC = ? and m.Matricule_Med = a.userId and a.userType = 'Medecin'`,
            cnx = await db.connect(),
            res = await cnx.query(req, [idSpec]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// params = {table : "tableName",id : "idKey"}
// ADAPTED
async function checkExistence(params, id, constraint = '') {
    try {
        let req = `SELECT COUNT(${params.id}) AS nb FROM ${params.table} WHERE ${params.id} = ? ${constraint}`,
            cnx = await db.connect(),
            res = await cnx.query(req, [id]);
        cnx.release();
        // 
        return res[0][0].nb > 0 ? true : false;
    } catch (err) {
        console.error('error :', err);
    }
}
// ADAPTED
async function consultationCheck(userId) {
    let table1Check = await checkExistence({
        table: "preConsultation",
        id: "MATRICULE_PAT"
    }, userId, 'AND accepted = false');
    // 
    if (!table1Check) {
        try {
            let req = `select count(*) as nb from consultation where JOUR_REPOS <= -1 AND idPreCons in (select idPreCons from preConsultation where MATRICULE_PAT = ?)`,
                cnx = await db.connect(),
                res = await cnx.query(req, [userId]);
            cnx.release();
            // 
            return res[0][0].nb > 0 ? true : false;
        } catch (err) {
            console.error('error :', err);
        }
    } else return true;
}
// ADAPTED
async function getPatientPreConsultationDataById(userId) {
    try {
        let req = `SELECT concat(NOM_PAT,' ',Prenom_PAT) AS nom,TIMESTAMPDIFF(YEAR, Date_Naissence, CURDATE()) AS age,Tel AS tel FROM patients WHERE MATRICULE_PAT = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [userId]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// ADAPTED
async function getLastInsertedNotification(userId, accepted = false) {
    try {
        let req = `SELECT * FROM preConsultation WHERE accepted = ${accepted} AND MATRICULE_PAT = ? ORDER BY dateCreation DESC LIMIT 1`,
            cnx = await db.connect(),
            res = await cnx.query(req, [userId]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// ADAPTED
async function getRoomIdByNotifId(notifId) {
    try {
        let req = `SELECT p.accepted,r.roomId,r.userPatientMatricule FROM preConsultation AS p,room AS r WHERE p.MATRICULE_PAT = r.userPatientMatricule AND p.idPreCons = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [notifId]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// ADAPTED
async function notificationsByMedecin(medecinId) {
    try {
        let req = `select idPreCons,MATRICULE_PAT from preConsultation where accepted = false and idPreCons in (select idPreCons from medecinInbox where Matricule_Med = ?)`,
            cnx = await db.connect(),
            res = await cnx.query(req, [medecinId]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// ADAPTED
async function getAcceptedMedecinNotificationsInfos(medecinId) {
    try {
        let req = `select p.idPreCons,concat(pt.NOM_PAT,' ',pt.Prenom_PAT) as nom,p.dateCreation,c.DATE_CONSULTATION,c.JOUR_REPOS,p.MATRICULE_PAT,au.roomId from patients as pt,preConsultation as p,consultation as c,appUser as au where p.idPreCons = c.idPreCons and c.Matricule_Med = ? and p.accepted = true and pt.MATRICULE_PAT = p.MATRICULE_PAT and au.userId = p.MATRICULE_PAT ORDER BY JOUR_REPOS ASC,dateCreation DESC`,
            cnx = await db.connect(),
            res = await cnx.query(req, [medecinId]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// ADAPTED
async function checkPatientActiveNotifsExistance(patientId) {
    try {
        let req = `select count(c.idPreCons) as nb from consultation as c,preConsultation as p where p.idPreCons = c.idPreCons and p.MATRICULE_PAT = ? and p.accepted = true and c.JOUR_REPOS = -1`,
            cnx = await db.connect(),
            res = await cnx.query(req, [patientId]);
        cnx.release();
        // 
        return res[0][0].nb > 0 ? true : false;
    } catch (err) {
        console.error('error :', err);
    }
}
// ADAPTED
async function getRoomIdBySocketId(socketId) {
    try {
        let req = `SELECT r.roomId FROM room AS r,appUser as a WHERE (r.userPatientMatricule = a.userId OR r.userMedecinMatricule = a.userId) AND a.socket = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [socketId]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0].roomId : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// ADAPTED
async function getNotacceptedYetNotifs(patientId) {
    try {
        let req = `select * from preConsultation where MATRICULE_PAT = ? and idPreCons not in(select idPreCons from consultation)`,
            cnx = await db.connect(),
            res = await cnx.query(req, [patientId]);
        cnx.release();
        // 
        return res[0].length > 0 ? true : false;
    } catch (err) {
        console.error('error :', err);
    }
}
// ADAPETD
async function getNotifIdByRoomId(roomId, medecinId) {
    try {
        let req = `SELECT p.idPreCons FROM preConsultation AS p,room AS r WHERE p.MATRICULE_PAT = r.userPatientMatricule AND r.roomId = ? AND r.userMedecinMatricule = ? AND p.idPreCons in (SELECT idPreCons FROM consultation WHERE JOUR_REPOS = -1)`,
            cnx = await db.connect(),
            res = await cnx.query(req, [roomId, medecinId]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0].idPreCons : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// 
// EXAMPLE OF params = {table : "ss",id : "userId"}
async function customDataDelete(params, id) {
    try {
        let req = `DELETE FROM ${params.table} WHERE ${params.id} = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [id]);
        cnx.release();
        // 
        return res[0].affectedRows;
    } catch (err) {
        console.error('error :', err);
    }
}
// ADAPTED
async function getMedecinNameWithConsul(patientId) {
    try {
        let req = `select m.NOM_MED,s.NOM_SPEC from medecin as m,specialites as s where m.ID_SPEC = s.ID_SPEC and m.Matricule_Med in (select linkedMedecinMatricule from appUser where userId = ?)`,
            cnx = await db.connect(),
            res = await cnx.query(req, [patientId]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// 
async function getPatientNotificationsByMatricule(patientId) {
    try {
        let req = `select c.idPreCons as nid, c.JOUR_REPOS as jr,c.DATE_CONSULTATION as dc from consultation as c,preConsultation as p where p.idPreCons = c.idPreCons and p.MATRICULE_PAT = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [patientId]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// 
async function getToSendToDoctors() {
    try {
        let req = `select m.Matricule_Med,a.socket FROM medecin as m,appUser as a where m.Matricule_Med = a.userId and a.userType = 'Medecin'`,
            cnx = await db.connect(),
            res = await cnx.query(req, []);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// 
// 
async function authGetUserData(userId) {
    try {
        let resData = null;
        let req = `SELECT userId,userType FROM appUser WHERE userId = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [userId]);
        if (res[0].length > 0) {
            req = `SELECT CONCAT(?,' ',?) AS nom FROM ? WHERE ? = ?`;
            let inData = {
                patient: [
                    "NOM_PAT",
                    "Prenom_PAT",
                    "patients",
                    "MATRICULE_PAT"
                ],
                medecin: [
                    "NOM_MED",
                    '',
                    'medecin',
                    'Matricule_Med'
                ]
            }
            let res2 = await cnx.query(req, [res[0][0].userType == 'Patient' ? inData.patient : inData.medecin, res[0][0].userId]);
            // 
            resData = res2[0].length > 0 ? {
                id: res[0][0].userId,
                type: res[0][0].userType,
                nom: res2[0][0].nom
            } : {
                id: res[0][0].userId,
                type: res[0][0].userType,
                nom: null
            };
        }
        cnx.release();
        return resData;
    } catch (err) {
        console.error('error :', err);
    }
}
// 
async function authGetUserData(userId) {
    try {
        let resData = null;
        let req = `SELECT userId,userType FROM appUser WHERE userId = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [userId]);
        if (res[0].length > 0) {
            let inData = {
                patient: `SELECT CONCAT(NOM_PAT,' ',Prenom_PAT) AS nom FROM patients WHERE MATRICULE_PAT = ?`,
                medecin: `SELECT NOM_MED AS nom FROM medecin WHERE Matricule_Med = ?`
            }
            let res2 = await cnx.query(res[0][0].userType == 'Patient' ? inData.patient : inData.medecin, [res[0][0].userId]);
            // 
            resData = res2[0].length > 0 ? {
                id: res[0][0].userId,
                type: res[0][0].userType,
                nom: res2[0][0].nom
            } : {
                id: res[0][0].userId,
                type: res[0][0].userType,
                nom: null
            };
        }
        cnx.release();
        // console.log(resData);
        return resData;
    } catch (err) {
        console.error('error :', err);
    }
}
// 
//#endregion
// 
//#region HELPER FUNCTIONS
function getClassValues(data) {
    let tableName, fieldsNames, fieldsPlaceHolders = '',
        values;
    // GET CLASS NAME FROM OBJECT
    tableName = data.constructor.name;
    // GET FIELD NAMES
    fieldsNames = Object.keys(data).join(',');
    // GET THE NUMBER OF '?' TO PLACE
    Object.keys(data).forEach(key => {
        fieldsPlaceHolders += '?,';
    });
    //REMOVE THE LAST CHAR ','
    fieldsPlaceHolders = removeLastChar(fieldsPlaceHolders);
    // GET THE VALUES
    values = Object.values(data);
    // 
    return {
        tableName,
        fieldsNames,
        fieldsPlaceHolders,
        values
    }
}

function getObjectKeysWithValues(data) {
    return [
        Object.keys(data),
        Object.values(data)
    ]
}

function removeLastChar(str) {
    return str.substring(0, str.length - 1);
}
//#endregion
module.exports = {
    insertData,
    getDataAll,
    getAppUserDataById,
    getAppUserCustomData,
    getAppUserCustomDataBySocket,
    customDataUpdate,
    getTypeById,
    getVilles,
    getOnlineMedecinsWithCityAndProffession,
    checkExistence,
    consultationCheck,
    getPatientPreConsultationDataById,
    getLastInsertedNotification,
    getRoomIdByNotifId,
    notificationsByMedecin,
    getAcceptedMedecinNotificationsInfos,
    checkPatientActiveNotifsExistance,
    getRoomIdBySocketId,
    getNotacceptedYetNotifs,
    getNotifIdByRoomId,
    customDataDelete,
    getMedecinNameWithConsul,
    getPatientNotificationsByMatricule,
    getToSendToDoctors,
    authGetUserData
}
// 