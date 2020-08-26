const fse = require('fs-extra');
const PDFDocument = require("pdfkit");
const path = require('path');
const {
    getUtc,
    fromUtcToTimeZone
} = require('../helper/date');

// 
async function makeReport(data) {
    // console.log(data);
    try {
        const retData = await getFileName(data.client.id, data.iteration);
        const __FILEPATH = retData.__FILENAME;
        // 
        // 
        let document = new PDFDocument({
            margin: 50
        });
        // HEADER
        document.image(path.join(__dirname, '../', 'serialisationResources', 'logo_2.png'), 50, 40, {
                height: 50
            }).fontSize(10)
            .text(fromUtcToTimeZone(data.consultation.preConsDateTimeZone, getUtc()), 200, 60, {
                align: "right"
            })
            .text(`${data.client.name}`, 200, 75, {
                align: "right"
            })
            .text(`${data.client.email}`, 200, 90, {
                align: "right"
            })
            .moveDown();
        // PRE-HEADER
        document.fontSize(12)
            .text('Entreprise :', 50, 120)
            .text(data.company.companyName, 125, 120)
            .text('Téléphone :', 50, 140)
            .text(data.company.companyTel, 125, 140)
            .text('Email : ', 50, 160)
            .text(data.company.companyEmail, 125, 160)
            .text('Adresse :', 50, 180)
            .text(data.company.companyAdrs, 125, 180);
        // generateHr(document, 200);

        // HEADER
        document.fontSize(20)
            .font('Helvetica')
            .text('Rapport', 50, 230, {});
        generateHr(document, 250);
        // // CONTENT
        document.fontSize(12)
            .text('Nom :', 50, 270)
            .text(data.visitor.visitorName, 200, 270)
            .text('Téléphone :', 50, 290)
            .text(data.visitor.visitorTel, 200, 290)
            .text('Sujet de consultation :', 50, 310)
            .text(data.consultation.preConsTitle, 200, 310)
            .text(`Commentaires sur le cas :`, 50, 330)
            .text(data.comment, 200, 330);
        generateHr(document, 360);
        // GENERATE THE PDF
        await savePdfToFile(document, __FILEPATH);
        // 
        return {
            status: true,
            filename: retData.minFileName,
            downloadLink: retData.__FILENAME
        };
        // });
    } catch (err) {
        console.log(err);
        return {
            status: false,
            filename: null
        };
    }
}
// 
async function getFileName(clientId, consNb) {
    const __PATH = `files/rapports`;
    await fse.ensureDir(__PATH);
    // const __PATH_YEARLY = __PATH + `/${new Date().getFullYear()}`;
    // await fse.ensureDir(__PATH_YEARLY);
    const __USERPATH = __PATH + `/${clientId}`;
    await fse.ensureDir(__USERPATH);
    const nbRapports = consNb + 1;
    const __FILENAME = __USERPATH + `/RAPP${nbRapports}.pdf`;
    // 
    return {
        __FILENAME,
        nbRapports,
        minFileName: `RAPP${nbRapports}.pdf`
    };
}

function generateHr(document, y) {
    document
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}
// 
function savePdfToFile(pdf, fileName) {
    return new Promise((resolve, reject) => {
        let pendingStepCount = 2;

        const stepFinished = () => {
            if (--pendingStepCount == 0) {
                resolve();
            }
        };

        const writeStream = fse.createWriteStream(fileName);
        writeStream.on('close', stepFinished);
        pdf.pipe(writeStream);

        pdf.end();

        stepFinished();

        // CREDITS : https://github.com/foliojs/pdfkit/issues/265#issuecomment-246564718
    });
}
// 
module.exports = {
    makeReport
};