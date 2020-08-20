const moment = require('moment');

module.exports = {
    getUtc: () => {
        // return moment.utc(new Date().getTime()).format('x')
        return moment.utc(new Date()).format('YYYY-MM-DD hh:mm:ss');
    }
}