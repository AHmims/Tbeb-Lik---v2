const {
    getUtc
} = require('./helper/date');

const data = {
    iteration: 1,
    client: {
        id: 'CL4',
        name: 'last last',
        email: 'test@email.fr'
    },
    comment: '',
    consultation: {
        preConsId: 'NOTIF-468625',
        preConsDateCreation: '2020-08-26 14:08:08',
        preConsDateTimeZone: 'Africa/Casablanca',
        preConsDesc: 'kqsdhkqjsh',
        preConsAccepted: 1,
        visitorId: 'VS3',
        preConsTitle: 'qnbd'
    },
    visitor: {
        visitorId: 'VS3',
        visitorName: 'yFOUR',
        visitorEmail: 'bobo@email.com',
        visitorPass: '$2b$10$wK1e4d3lis1xRTbmdZWfSOmUBPytpE6H50uIcBcQ47Qjo38xTXq7.',
        visitorTel: '0612345678',
        visitorSexe: 'male'
    },
    company: {
        companyId: 3,
        companyName: 'qjsh jhgjhgj',
        companyDesc: 'qks jqj hgjhqg',
        companyTel: 512345678,
        companyEmail: 'uqsuh@test.com',
        companyFJ: 'SARL',
        companyAdrs: 'jqhkj kjh kjh',
        companyDateCreation: '2020-08-26 14:08:08',
        companyDateTimeZone: 'Africa/Casablanca',
        expertiseId: 1
    }
}
async function test() {
    const __PDF = require('./model/savePdf');
    const reportGenRes = await __PDF.makeReport(data);
    console.log(reportGenRes);
    // const {
    //     getUtc,
    //     fromUtcToTimeZone
    // } = require('./helper/date');
    // console.log(fromUtcToTimeZone(data.consultation.preConsDateTimeZone, getUtc()));
}
test();