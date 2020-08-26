module.exports = {
    getUtc: (date = new Date()) => {
        const moment = require('moment');
        // return moment.utc(new Date().getTime()).format('x')
        return moment.utc(date).format('YYYY-MM-DD HH:MM');
    },
    fromUtcToTimeZone: (timeZone, date) => {
        const moment = require('moment-timezone');
        // console.log(date);
        // date = date.toString().split(' ').join('');
        return moment.utc(date).tz(timeZone).format('YYYY-MM-DD HH:MM');
        // console.log(moment.tz(date, timeZone).format('hh:mm DD/MM/YYYY'));
    }
}