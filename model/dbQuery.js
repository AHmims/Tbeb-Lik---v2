const db = require('./dbConfig');
const classes = require('./classes');
// 
// GET user auth Data by Email
// searchKey == "id" || "email"
async function getUserAuthData(searchKey = 'email', searchValue) {
    searchKey = searchKey == 'email' ? ['clientEmail', 'visitorEmail'] : ['clientId', 'visitorId']
    try {
        let req = `SELECT clientId AS userId,clientName as userName, clientEmail AS userEmail,clientPass AS userPass,'Client' AS userType FROM client WHERE ${searchKey[0]} = ? UNION SELECT visitorId AS userId, visitorName as userName, visitorEmail AS userEmail,visitorPass AS userPass,'Visitor' AS userType FROM visitor WHERE ${searchKey[1]} = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [searchValue, searchValue]);
        cnx.release();
        // 

        return res[0].length == 1 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
        return null;
    }
}
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
        return -1;
    }
}
// ONLY ACCEPT A CLASS AS INPUT
// FOR INSERTING TABLE WITH AUTOINCREMENT
// RETURN THE AUTOINCREMENTED VALUE AS A RESPONSE
async function insertDataWithResponse(data) {
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
        return res[0].affectedRows > 0 ? res[0].insertId : null;
    } catch (err) {
        console.error('error :', err);
        return null;
    }
}
// GET Count RECORDS
// params = {key:'key',value:'value'}
async function getRecordsLength(tableName, params = null) {
    let strExtra = '';
    if (params != null)
        strExtra = `WHERE ${params.key} = '${params.value}'`;
    try {
        let req = `SELECT COUNT(*) AS count FROM ?? ${strExtra}`,
            cnx = await db.connect(),
            res = await cnx.query(req, [tableName]);
        cnx.release();
        // 
        return res[0].length == 1 ? res[0][0].count : null;
    } catch (err) {
        console.error('error :', err);
        return null;
    }
}
// CHECK EMAIL EXSISTANCE
async function checkEmail(email) {
    try {
        let req = "SELECT SUM(`exists`) AS `exists` FROM((SELECT COUNT(*) AS `exists` FROM `client` WHERE `clientEmail` = ?) UNION ALL (SELECT COUNT(*) AS `exists` FROM `visitor` WHERE `visitorEmail` = ?)) t1",
            cnx = await db.connect(),
            res = await cnx.query(req, [email, email]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0].exists : null;
    } catch (err) {
        console.error('error :', err);
        return null;
    }
}
// GET ALL DATA
async function getAllData(tableName, constraint = '') {
    try {
        let req = `SELECT * FROM ${tableName} ${constraint}`,
            cnx = await db.connect(),
            res = await cnx.query(req);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0] : null;
    } catch (err) {
        console.error('error :', err);
        return null;
    }
}
// EXAMPLE OF params = {table : "ss",id : "userId"}
async function customDataDelete(params, id, constraint = '') {
    try {
        let req = `DELETE FROM ${params.table} WHERE ${params.id} = ? ${constraint}`,
            cnx = await db.connect(),
            res = await cnx.query(req, id);
        cnx.release();
        // 
        return res[0].affectedRows;
    } catch (err) {
        console.error('error :', err);
        return -1;
    }
}
// CHECK FOR REFCODE EXISTENCE, IF TRUE RETURN CLIENT ASSOCIATED WITH IT
async function checkRefcode(refCode) {
    try {
        let req = "SELECT ref.clientId, appU.companyId FROM `referral` AS ref, `appUser` AS appU WHERE ref.`refCode` = ? AND ref.clientId = appU.userId",
            cnx = await db.connect(),
            res = await cnx.query(req, [refCode]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
        return null;
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
    try {
        let req = `UPDATE ${params.table} SET ${strSection} WHERE ${params.id} = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, keyANDvalue[1]);
        cnx.release();
        // 
        return res[0].affectedRows > 0 ? true : false;
    } catch (err) {
        console.error('error :', err);
        return false;
    }
}
//Get visitor last inserted precons
async function visitorLastPrecons(visitorId) {
    try {
        let req = `SELECT preC.*, appU.linkToClient as clientId FROM preConsultation AS preC, appUser AS appU WHERE preC.preConsAccepted = -1 AND preC.visitorId = ? AND preC.visitorId = appU.userId ORDER BY preC.preConsDateCreation DESC;`,
            cnx = await db.connect(),
            res = await cnx.query(req, visitorId);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error(`error :`, err);
        return null;
    }
}
// GET ROOM DATA BY preCons_ID
async function getRoomByNotifId(notifId) {
    try {
        let req = `SELECT r.roomId,r.roomVisitorId FROM preConsultation AS p, room AS r WHERE LOWER(p.visitorId) = LOWER(r.roomVisitorId) AND p.preConsId = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, notifId);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
        return null;
    }
}
// 
// RETURN A BOOLEAN FOR EXISTENCE CHECK || params = {table : "tableName",id : "idKey"}
async function checkExistence(params, id, constraint = '') {
    try {
        let req = `SELECT COUNT(${params.id}) AS nb FROM ${params.table} WHERE ${params.id} = ? ${constraint}`,
            cnx = await db.connect(),
            res = await cnx.query(req, id);
        cnx.release();
        // 
        return res[0][0].nb > 0 ? true : false;
    } catch (err) {
        console.error('error :', err);
        return false;
    }
}
// CHECK IF A VISITOR HAVE AN ONOING CONSULTATION OR PRECONSULTATION TO DETERMINE WETHER HE IS ELIGABLE FOR SENDING A NEW PRECONS
async function consultationCheck(visitorId) {
    let table1Check = await checkExistence({
        table: "preConsultation",
        id: "visitorId"
    }, visitorId, 'AND preConsAccepted = -1');
    // 
    if (!table1Check) {
        try {
            let req = `select count(*) as nb from consultation where consulState <= -1 AND preConsId in (select preConsId from preConsultation where LOWER(visitorId) = LOWER(?))`,
                cnx = await db.connect(),
                res = await cnx.query(req, visitorId);
            cnx.release();
            // 
            return res[0][0].nb > 0 ? true : false;
        } catch (err) {
            console.error('error :', err);
            return false;
        }
    } else return null;
}
// GET CLIENTS UN-ACCEPTED NOTIFICATIONS
async function getClientPrecons(clientId) {
    try {
        let req = `SELECT preConsId,visitorId FROM preConsultation WHERE preConsAccepted = -1 AND visitorId IN (SELECT userId FROM appUser WHERE linkToClient = ?)`,
            cnx = await db.connect(),
            res = await cnx.query(req, clientId);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
// GET A VISITOR LAST INSERTED NOTIFICATION
async function getLastInsertedPrecons(visitorId, accepted = -1) {
    try {
        let req = `SELECT * FROM preConsultation WHERE preConsAccepted = ${accepted} AND LOWER(visitorId) = LOWER(?) ORDER BY preConsDateCreation DESC LIMIT 1`,
            cnx = await db.connect(),
            res = await cnx.query(req, visitorId);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
        return null;
    }
}
// GET CLIENT CONSULTATIONS
async function getClientConsultations(clientId) {
    try {
        let req = `select p.preConsId, p.preConsTitle, p.preConsDesc, vis.visitorTel as tel, vis.visitorName as nom, p.preConsDateCreation, p.preConsDateTimeZone, c.consulDate, c.consulTimeZone, c.consulState, p.visitorId, au.roomId from visitor as vis, preConsultation as p, consultation as c,appUser as au where p.preConsId = c.preConsId and LOWER(c.clientId) = LOWER(?) and p.preConsAccepted = 1 and LOWER(vis.visitorId) = LOWER(p.visitorId) and LOWER(au.userId) = LOWER(p.visitorId) ORDER BY consulState ASC,consulDate DESC`,
            cnx = await db.connect(),
            res = await cnx.query(req, clientId);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0] : null;
    } catch (err) {
        console.error('error :', err);
        return null;
    }
}
// GET CONSULTATION DATA
async function getConsultation(notifId) {
    try {
        let req = `select p.preConsId, p.preConsTitle, p.preConsDesc, vis.visitorTel as tel, vis.visitorName as nom, p.preConsDateCreation, p.preConsDateTimeZone, c.consulDate, c.consulTimeZone, c.consulState, p.visitorId, au.roomId from visitor as vis, preConsultation as p, consultation as c,appUser as au where p.preConsId = c.preConsId and p.preConsId = ? and LOWER(vis.visitorId) = LOWER(p.visitorId) and LOWER(au.userId) = LOWER(p.visitorId) ORDER BY consulState ASC,consulDate DESC`,
            cnx = await db.connect(),
            res = await cnx.query(req, notifId);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
        return null;
    }
}
// GET NON ACTIVE VISITOR CONSULTATIONS / PRECONSULTATIONS
async function getVisitorConsHistory(visitorId) {
    try {
        let req = `SELECT pre.*, con.consulDate FROM preConsultation as pre  LEFT JOIN consultation con ON pre.preConsId = con.preConsId WHERE pre.visitorId = ? AND pre.preConsAccepted <> -1 AND pre.preConsId NOT IN (SELECT preConsId FROM consultation WHERE consulState = -1) ORDER BY pre.preConsDateCreation DESC`,
            cnx = await db.connect(),
            res = await cnx.query(req, visitorId);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0] : null;
    } catch (err) {
        console.error('error :', err);
        return null;
    }
}
// GET MESSAGES BY NOTIFICATIONID
async function getMessages(userId, notifId) {
    try {
        let req = "SELECT *, (msgSender = ?) AS my_msg FROM `message` WHERE preConsId = ?",
            cnx = await db.connect(),
            res = await cnx.query(req, [userId, notifId]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0] : [];
    } catch (err) {
        console.error('error :', err);
        return [];
    }
}
// GET ROOMID BY USER
async function getRoomIdByUser(userId) {
    try {
        let req = "SELECT roomId FROM room WHERE (roomVisitorId = ? OR roomClientId = ?)",
            cnx = await db.connect(),
            res = await cnx.query(req, [userId, userId]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0].roomId : null;
    } catch (err) {
        console.error(`error :`, err);
        return null;
    }
}
// THE NUMBER OF THE GIVEN CLIENT FINISHED CONSULTATIONS
async function getClientFinishedConsultationsCount(clientId) {
    try {
        let req = "SELECT COUNT(*) as cons_count FROM consultation WHERE clientId = ? AND consulState <> '-1'",
            cnx = await db.connect(),
            res = await cnx.query(req, clientId);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0].cons_count : null;
    } catch (err) {
        console.error(`error :`, err);
        return null;
    }
}

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

// EXPORTS modules
module.exports = {
    getUserAuthData,
    insertData,
    getRecordsLength,
    checkEmail,
    getAllData,
    customDataDelete,
    checkRefcode,
    insertDataWithResponse,
    customDataUpdate,
    visitorLastPrecons,
    getRoomByNotifId,
    consultationCheck,
    checkExistence,
    getClientPrecons,
    getLastInsertedPrecons,
    getClientConsultations,
    getConsultation,
    getVisitorConsHistory,
    getMessages,
    getRoomIdByUser,
    getClientFinishedConsultationsCount
}