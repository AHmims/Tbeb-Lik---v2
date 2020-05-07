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
        let req = `SELECT * FROM appUser where ID_USER = ? LIMIT 1`,
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
        let req = `SELECT ${slctdKeys} FROM appUser where ID_USER = ? LIMIT 1`,
            cnx = await db.connect(),
            res = await cnx.query(req, [id]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0][0] : null;
    } catch (err) {
        console.error('error :', err);
    }
}
async function getAppUserCustomDataBySocket(keys, socketId) {
    let slctdKeys = '';
    keys.forEach(key => {
        slctdKeys += `appUser.${key},`;
    });
    slctdKeys = removeLastChar(slctdKeys);

    try {
        let req = `SELECT ${slctdKeys} FROM appUser where appUser.SOCKET = ? LIMIT 1`,
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
// 
async function getVilles() {
    try {
        let req = `SELECT distinct(VILLE) FROM medecin;`,
            cnx = await db.connect(),
            res = await cnx.query(req);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0] : [];
    } catch (err) {
        console.error('error :', err);
    }
}
// 
async function getOnlineMedecinsWithCityAndProffession(ville, idSpec) {
    try {
        let req = `select m.MATRICULE_MED,a.SOCKET FROM medecin as m,appUser as a where m.VILLE = ? and m.ID_SPEC = ? and m.MATRICULE_MED = a.ID_USER and a.TYPE_USER = 'Medecin' and ONLINE  = true`,
            cnx = await db.connect(),
            res = await cnx.query(req, [ville, idSpec]);
        cnx.release();
        // 
        return res[0].length > 0 ? res[0] : null;
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
    getOnlineMedecinsWithCityAndProffession
}
// 