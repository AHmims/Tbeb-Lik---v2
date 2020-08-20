const moment = require('moment');
var MOM = require('moment-timezone');
// 
console.log(moment(new Date()).format('YYYY-MM-DD hh:mm:ss'));
console.log(moment.utc(new Date().getTime()).format('x'));
var x = moment.utc(new Date().getTime()).format('X');
console.log(moment.utc(new Date()).format('YYYY-MM-DD hh:mm:ss'));
console.log(MOM.utc(moment.unix(x).format()).tz('Africa/Casablanca').format('YYYY-MM-DD hh:mm:ss'));
x = moment.utc(new Date()).format('YYYY-MM-DD hh:mm:ss');
console.log(moment(moment.utc(x).toDate()).local().format('YYYY-MM-DD hh:mm:ss'));