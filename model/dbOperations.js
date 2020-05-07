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
// 
// 
// 
async function getTypeById(id) {
    let type = 'null';
    try {
        let req = `SELECT count(*) as nb FROM patient where MATRICULE_PAT = ?`,
            cnx = await db.connect(),
            res = await cnx.query(req, [id]);
        // 
        type = res[0][0].nb > 0 ? "Patient" : 'null';
        if (type == 'null') {
            req = `SELECT count(*) as nb FROM medecin where MATRICULE_MED = ?`;
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
    getTypeById
}
// 