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
    insertDataWithResponse
}