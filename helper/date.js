module.exports = {
    getUtc: (date = new Date()) => {
        // const moment = require('moment');
        // return moment.utc(new Date().getTime()).format('x')
        // return moment.utc(date).format('YYYY-MM-DD HH:mm');
        return date;
    },
    fromUtcToTimeZone: (timeZone, date) => {
        // const moment = require('moment-timezone');
        // return moment.utc(date).tz(timeZone).format('YYYY-MM-DD HH:mm');
        const moment = require('moment');
        const server_time_diff = 0;
        var dateObject = new Date(date);
        dateObject.setHours(dateObject.getHours() + server_time_diff);
        return moment(dateObject).format('YYYY-MM-DD HH:mm');
    }
}