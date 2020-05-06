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
// 
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
async function getAppUserDataById(id) {
    try {
        let req = `SELECT * FROM appUser where userId = ? LIMIT 1`,
            cnx = await db.connect(),
            res = await cnx.query(req, [id]);
        cnx.release();
        // 
        if (res[0].length > 0)
            return res[0][0];
        else if (res[0].length == 0)
            return null;
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
        return res[0][0];
    } catch (err) {
        console.error('error :', err);
    }
}
// GET USERS BY MEDECIN ID
async function getAppUserPatientsByMedecinId(id) {
    try {
        let req = `SELECT a.*,p.NOM_PAT,p.Prenom_PAT FROM appUser AS a,patients AS p WHERE a.linkedMedecinMatricule = ? AND a.userId = p.MATRICULE_PAT`,
            cnx = await db.connect(),
            res = await cnx.query(req, [id]);
        cnx.release();
        // 
        return res[0];
    } catch (err) {
        console.error('error :', err);
    }
}
// 
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
        if (res[0].length > 0)
            return res[0][0];
        else if (res[0].length == 0)
            return null;
    } catch (err) {
        console.error('error :', err);
    }
}
// GET NOTIFICATION ID BY PATIENT ID
async function getNotificationDataByPatientId(id, accepted) {
    try {
        let req = `SELECT * FROM preconsultation WHERE MATRICULE_PAT = ? AND accepted = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [id, accepted]);
        cnx.release();
        // 
        return res[0];
    } catch (err) {
        console.error('error :', err);
    }
}
// EXAMPLE OF KEY {online : false,socket : 'ssss'} | params = {table : "ss",id : "userId"}
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
// 
async function getRoomId(key, id) {
    try {
        let req = `SELECT roomId FROM room WHERE ${key} = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [id]);
        cnx.release();
        // 
        if (res[0].length > 0)
            return res[0][0];
        else if (res[0].length == 0)
            return null;
    } catch (err) {
        console.error('error :', err);
    }
}
// 
async function getRoomIdByNotifId(notifId) {
    try {
        let req = `SELECT p.accepted,r.roomId FROM preConsultation AS p,room AS r WHERE p.MATRICULE_PAT = r.userPatientMatricule AND p.idPreCons = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [notifId]);
        cnx.release();
        // 
        if (res[0].length > 0)
            return res[0][0];
        else if (res[0].length == 0)
            return null;
    } catch (err) {
        console.error('error :', err);
    }
}
// 
async function getRoomIdBySocketId(socketId) {
    try {
        let req = `SELECT r.roomId FROM room AS r,appUser as a WHERE (r.userPatientMatricule = a.userId OR r.userMedecinMatricule = a.userId) AND a.socket = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [socketId]);
        cnx.release();
        // 
        if (res[0].length > 0)
            return res[0][0];
        else if (res[0].length == 0)
            return null;
    } catch (err) {
        console.error('error :', err);
    }
}
// 
async function getRoomDataById(roomId) {
    try {
        let req = `SELECT * FROM room WHERE roomId = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [roomId]);
        cnx.release();
        // 
        if (res[0].length > 0)
            return res[0][0];
        else if (res[0].length == 0)
            return null;
    } catch (err) {
        console.error('error :', err);
    }
}
// params = {table : "tableName",id : "idKey"}
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
// 
async function getPatientPreConsultationDataById(userId) {
    try {
        let req = `SELECT concat(NOM_PAT,' ',Prenom_PAT) AS nom,TIMESTAMPDIFF(YEAR, Date_Naissence, CURDATE()) AS age,Tel AS tel FROM patients WHERE MATRICULE_PAT = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [userId]);
        cnx.release();
        // 
        if (res[0].length > 0)
            return res[0][0];
        else if (res[0].length == 0)
            return null;
    } catch (err) {
        console.error('error :', err);
    }
}
// 
async function getLastInsertedNotification(userId) {
    try {
        let req = `SELECT * FROM preConsultation WHERE accepted = FALSE AND  MATRICULE_PAT = ? ORDER BY dateCreation DESC LIMIT 1`,
            cnx = await db.connect(),
            res = await cnx.query(req, [userId]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// 
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
// 
async function getPatientDoculentDataFromMedecinId(medecinId) {
    try {
        let req = `select MATRICULE_PAT as mle,NOM_PAT as nom,Prenom_PAT as prenom,Direction as direction from patients where MATRICULE_PAT in (select userPatientMatricule from room where userMedecinMatricule = ?)`,
            cnx = await db.connect(),
            res = await cnx.query(req, [medecinId]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// 
async function getChatPatients(medecinId, constraint) {
    // console.log(medecinId);
    try {
        let req = `SELECT a.userId,a.online,CONCAT(p.NOM_PAT,' ',p.Prenom_PAT) as nom,n.idPreCons FROM appUser AS a,patients AS p,preConsultation AS n WHERE a.linkedMedecinMatricule = ? AND a.userId = p.MATRICULE_PAT AND a.userId = n.MATRICULE_PAT ${constraint}`,
            cnx = await db.connect(),
            res = await cnx.query(req, [medecinId]);
        cnx.release();
        // 
        // console.log(res[0]);
        return res[0];
    } catch (err) {
        console.error('error :', err);
    }
}
// 
async function getAllPatientNotification(id) {
    try {
        let req = `SELECT c.JOUR_REPOS,c.DATE_CONSULTATION,p.idPreCons FROM preConsultation as p,consultation as c WHERE p.idPreCons = c.idPreCons AND p.accepted = true AND p.MATRICULE_PAT = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [id]);
        cnx.release();
        // 
        return res[0];
    } catch (err) {
        console.error('error :', err);
    }
}
// 
async function getNotificationdata(notifId) {
    try {
        let req = `select p.accepted,c.DATE_CONSULTATION,c.JOUR_REPOS from preConsultation as p,consultation as c where p.idPreCons = ? and p.idPreCons = c.idPreCons`,
            cnx = await db.connect(),
            res = await cnx.query(req, [notifId]);
        cnx.release();
        // 
        // console.log(req);
        // console.log(res[0]);
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
    }

}
//
async function selectFirstConsultationForChat(medecinId) {
    try {
        let req = `select c.idPreCons,p.MATRICULE_PAT from consultation as c,preconsultation as p where c.idPreCons = p.idPreCons and Matricule_Med = ? order by JOUR_REPOS asc, DATE_CONSULTATION asc limit 1`,
            cnx = await db.connect(),
            res = await cnx.query(req, [medecinId]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// 
async function getPatientDataById(id) {
    try {
        let req = `SELECT * FROM patients where MATRICULE_PAT = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [id]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
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
    getAppUserPatientsByMedecinId,
    getAppUserCustomDataBySocket,
    getNotificationDataByPatientId,
    customDataUpdate,
    getRoomId,
    getRoomIdByNotifId,
    getRoomIdBySocketId,
    getRoomDataById,
    checkExistence,
    getPatientPreConsultationDataById,
    getLastInsertedNotification,
    consultationCheck,
    getPatientDoculentDataFromMedecinId,
    getChatPatients,
    getAllPatientNotification,
    getNotificationdata,
    selectFirstConsultationForChat,
    getPatientDataById
}
// 