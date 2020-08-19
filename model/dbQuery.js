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
// EXPORTS modules
module.exports = {
    getUserAuthData
}