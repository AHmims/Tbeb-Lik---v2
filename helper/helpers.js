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
            res.status(responseCode).end();
    }
}
// 
module.exports = {
    status,
    response
}