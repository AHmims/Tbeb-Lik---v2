const moment = require('moment');

module.exports = {
    getUtc: (date = new Date()) => {
        // return moment.utc(new Date().getTime()).format('x')
        return moment.utc(date).format('YYYY-MM-DD hh:mm:ss');
    }
}