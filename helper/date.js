const moment = require('moment');

module.exports = {
    getUtc: () => {
        return moment.utc(new Date().getTime()).format('x')
    }
}