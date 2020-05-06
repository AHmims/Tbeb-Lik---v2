const fse = require('fs-extra');
const PDFDocument = require("pdfkit");
const path = require('path');
// 
const dataTemplate = {
    mle: "FST56OP",
    nom: "ali",
    prenom: "hmims",
    direction: "DOKALA",
    nbrJA: "12",
    nbrJV: "20",
    visaM: "UYUYUYUYUYUY"
}
// 
async function makeDoc(data) {
    try {
        const retData = await getFileName(data.mle);
        const __FILEPATH = retData.__FILENAME;
        // 
        let document = new PDFDocument({
            margin: 50
        });
        // HEADER
        document.image(path.join(__dirname, '../', 'serialisationResources', 'logo.png'), 50, 40, {
                height: 50
            }).fontSize(10)
            .text(`${new Date().toGMTString()}`, 200, 60, {
                align: "right"
            })
            .text(`${data.mle}`, 200, 75, {
                align: "right"
            })
            .text(`${data.nom} ${data.prenom.toUpperCase()}`, 200, 90, {
                align: "right"
            })
            .moveDown();
        // CONTENT
        document.fontSize(20)
            .font('Helvetica')
            .text('Rapport', 50, 150, {});
        generateHr(document, 180);
        document.fontSize(12)
            .text('Nom :', 50, 200, {
                align: "left"
            })
            .text('Matricule :', 50, 220, {
                align: "left"
            })
            .text('Direction :', 50, 240, {
                align: "left"
            })
            .text('Nombre de jour du RM :', 50, 260, {
                align: "left"
            });
        generateHr(document, 280);

        document.text('Nombre de jour validée :', 300, 300, {
                align: "left"
            })
            .text('Visa de Medecin :', 300, 320, {
                align: "left"
            });
        // FILL DATA
        let fillData = [
            `${data.nom} ${data.prenom.toUpperCase()}`,
            data.mle,
            data.direction,
            data.nbrJA
        ]
        let startPos = 200;
        fillData.forEach(element => {
            document.text(element, 200, startPos, {
                align: "left"
            });
            startPos += 20;
        });
        // 
        document.text(data.nbrJV, 400, 300, {
                align: "right"
            })
            .text(data.visaM, 400, 320, {
                align: "right"
            }).moveDown();
        // 
        await savePdfToFile(document, __FILEPATH);
        // 
        return true;
        // });
    } catch (err) {
        console.log(err);
        return false;
    }
}
// 
async function getFileName(matricule) {
    const __PATH = `data/rapports`;
    await fse.ensureDir(__PATH);
    const __PATH_YEARLY = __PATH + `/${new Date().getFullYear()}`;
    await fse.ensureDir(__PATH_YEARLY);
    const __USERPATH = __PATH_YEARLY + `/${matricule}`;
    await fse.ensureDir(__USERPATH);
    const nbRapports = (await fse.readdir(__USERPATH)).length + 1;
    const __FILENAME = __USERPATH + `/RAPP${nbRapports}.pdf`;
    // 
    return {
        __FILENAME,
        nbRapports
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
    makeDoc
}