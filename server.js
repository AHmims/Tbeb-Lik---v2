//PACKAGES DECLARATION
const __FS = require('fs');
const __EXPRESS = require('express');
const __APP = __EXPRESS();
const __SERVER = require('https').createServer({
    key: __FS.readFileSync('./key.pem'),
    cert: __FS.readFileSync('./cert.pem'),
    passphrase: 'tbeblik'
}, __APP);
const __IO = require('socket.io')(__SERVER);
const __PATH = require('path');
//IMPORTED MODULES
// const __PDF = require('./model/savePdf');
const _CLASSES = require('./model/classes');
const _DB = require('./model/dbOperations');
//GLOBAL VARIABLES
const __PORT = process.env.PORT || 8080;
//MIDDLEWARES
__APP.use(__EXPRESS.urlencoded({
    extended: true
}));
__APP.use(__EXPRESS.json());
__APP.use(__EXPRESS.static(__PATH.join(__dirname, 'public')));
// 
// NOTIICATION SYSTEM
const __HUB = __IO.of('/medecinHub');
//TRAITMENT
__IO.on('connection', socket => {
    socket.on('newUser', async (matricule) => {
        console.log('--------');
        if (matricule != null) {
            let type = await _DB.getTypeById(matricule);
            console.log('newUser() | type => ', type);
            if (type != null) {
                let existingUser = await _DB.getAppUserDataById(matricule);
                console.log('newUser() | existingUser => ', existingUser)
                // 
                if (existingUser != null) {
                    let updatingResult = await _DB.customDataUpdate({
                        SOCKET: socket.id,
                        ONLINE: true
                    }, existingUser.ID_USER, {
                        table: "appUser",
                        id: "ID_USER"
                    });
                    // 
                    console.log('newUser() | updatingResult => ', updatingResult);
                    // 
                } else {
                    let userInstance = makeUserInstance(matricule, type, socket.id);
                    console.log('newUser() | userInstance => ', userInstance);
                    let insertResult = await _DB.insertData(userInstance);
                    console.log('newUser() | insertResult => ', insertResult);
                }
            }
        } else
            console.log('newUser() | matricule == null');
    });
    socket.on('sendNotif', async data => {
        console.log('------');
        console.log('sendNotif() | receivedData => ', data);
        // GET USERID FROM SOCKET
        let appUserData = await _DB.getAppUserCustomDataBySocket(["ID_USER"], socket.id);
        console.log('sendNotif() | appUserData => ', appUserData);
        if (appUserData != null) {
            // CHECK IF THE PATIENT GOT ANY ONGOING DEMANDES
            let exists = await _DB.consultationCheck(appUserData.ID_USER);
            console.log('sendNotif() | exists => ', exists);
            if (!exists) {
                // GET ONLINE DOCTORS FROM THE GIVEN CITY AND PROFESSIONS
                let listMedecins = await _DB.getOnlineMedecinsWithCityAndProffession(data.ville, data.proffession);
                console.log('sendNotif() | listMedecins => ', listMedecins);
                if (listMedecins != null) {
                    // INSERT DATA INTO TABLE PRECONSULTATION
                    let insertRes = await _DB.insertData(new _CLASSES.preConsultation(null, null, '', '', -1, false, appUserData.ID_USER));
                    console.log('sendNotif() | insertData(preConsultation) => ', insertRes);
                    // SELECTION DES MEDECINS ET  L'ENVOI DES NOTIFICATIONS
                    const MAX_NB = listMedecins.length >= 3 ? 3 : listMedecins.length;
                    console.log('sendNotif() | MAX_NB => ', MAX_NB);
                    let randomIndexes = [];
                    while (randomIndexes.length < MAX_NB) {
                        var index = Math.floor(Math.random() * listMedecins.length);
                        if (randomIndexes.indexOf(index) == -1) randomIndexes.push(index);
                    }
                    // 
                    console.log('sendNotif() | randomIndexes => ', randomIndexes);
                    // ARRAY OF MAX 3, OF DOCTORS ID
                    let tableauDesMedecins = [];
                    let notifData = await getNotificationFullData(appUserData.ID_USER);
                    randomIndexes.forEach(async index => {
                        tableauDesMedecins.push(listMedecins[index].MATRICULE_MED);
                        let inboxInsertResult = await _DB.insertData(new _CLASSES.medecinInbox(notifData.index, listMedecins[index].MATRICULE_MED));
                        console.log('sendNotif() | inboxInsertResult => ', inboxInsertResult);
                        __HUB.to(`/medecinHub#${listMedecins[index].SOCKET}`).emit('receivedNotification', notifData);
                    });
                    console.log('sendNotif() | tableauDesMedecins => ', tableauDesMedecins);
                    //SEND FEEDBACK TO THE SENDER
                    __IO.to(socket.id).emit('queryResult', {
                        status: 2,
                        data: randomIndexes.length
                    });
                    // 
                } else {
                    //SEND FEEDBACK TO THE SENDER
                    __IO.to(socket.id).emit('queryResult', {
                        status: 0,
                        data: null
                    });
                    console.log('sendNotif() | listMedecins : no person found with the given values');
                }
            } else {
                // YOU ALREADY HAVE AN ONGOING DEMANDE YOU CAN'T SEND ANYMORE SHIT
                console.log('sendNotif() | exists : User have ongoing notification');
                __IO.to(socket.id).emit('queryResult', {
                    status: 1,
                    data: null
                });
            }
        }
    });
    socket.on('acceptNotif', async (notifId) => {
        console.log('------');
        // TO STAY IN THE CLEAR HOW NOTIFICATIONS WORKS,
        // A DOCOTR ACCEPTS THE NOTIFICATION WHICH RESULTS INSENDING
        // A SOCKET TO ALL ASSOCIATED MEDECINS TO REMOVE THE NOTIF BOX
        // FOR THEM. ALL GOOD RIGHT ?
        // NO!! WHAT IF THEY HAVE SLOW INTERNET ?
        // DOCTOR A WILL ACCEPT THE NOTIFICATION BUT DOCOTR B STILL HAVE IT DISPLAYED IN HIS UI
        // BECAUSE SLOW INETNET REMEMEBER ?
        // TO STAY SAFE, LETS DO A CHECK FOR THE NOTIFICATION AND SEE IF IT'S ACCEPTED OR NOT
        // IF NOT PROCCED SAFELY
        // IF IT WAS ACCEPTED RETURN AN ERROR TO THE SENDER INFORMING THEM 
        // THAT THE NOTIFICATION WAS ACCEPTED
        // 
        let conultationCheck = await _DB.checkExistence({
            table: 'consultation',
            id: 'ID_PRECONS'
        }, notifId, '');
        // 
        if (!conultationCheck) {
            let medecin = await _DB.getAppUserCustomDataBySocket(["ID_USER"], socket.id);
            if (medecin != null) {
                console.log('acceptNotif() | medecin => ', medecin);
                let room = await _DB.getRoomIdByNotifId(notifId);
                if (room != null) {
                    console.log('acceptNotif() | room => ', room);
                    // 
                    let patientUpdate = await _DB.customDataUpdate({
                        MATRICULE_MED: medecin.ID_USER
                    }, room.MATRICULE_PAT, {
                        table: "appUser",
                        id: "ID_USER"
                    });
                    console.log('acceptNotif() | patientUpdate => ', patientUpdate);
                    // 
                    let roomUpdate = await _DB.customDataUpdate({
                        MATRICULE_MED: medecin.ID_USER
                    }, room.ID_ROOM, {
                        table: "room",
                        id: "ID_ROOM"
                    });
                    console.log('acceptNotif() | roomUpdate => ', roomUpdate);
                    // 
                    let notificationUpdate = await _DB.customDataUpdate({
                        ACCEPTE: true
                    }, notifId, {
                        table: "preConsultation",
                        id: "ID_PRECONS"
                    });
                    console.log('acceptNotif() | notificationUpdate => ', notificationUpdate);
                    // 
                    let consultationInsert = await _DB.insertData(new _CLASSES.consultation(-1, new Date(Date.now()), medecin.ID_USER, '', notifId));
                    console.log('acceptNotif() | consultationInsert => ', consultationInsert);
                } else
                    console.log('acceptNotif() | room not found');
            } else
                console.log('acceptNotif() | medecin not found');
        } else
            console.log('acceptNotif() | consultation deja accepté');
    });
    socket.on('disconnect', async () => {
        console.log('--------');
        let appUserData = await _DB.getAppUserCustomDataBySocket(["ID_USER", "TYPE_USER", "MATRICULE_MED"], socket.id);
        console.log('disconnect() | appUserData => ', appUserData);
        if (appUserData != null) {
            // IF A USER DISCONNECTS SET THEIR STATUS TO OFFLINE
            let updatingResult = await _DB.customDataUpdate({
                ONLINE: false
            }, appUserData.ID_USER, {
                table: "appUser",
                id: "ID_USER"
            });
            // 
            console.log('disconnect() | updatingResult => ', updatingResult);
        }
    });
    //  
});
// 
__HUB.on('connection', socket => {
    console.log('------');
    console.log('Hub/connection doctorConnected => ', socket.id);
    // socket.on('updateNotif', (notifId) => {
    //     __HUB.emit('notifAccepted', notifId);
    // });
});
// 
// 
function makeUserInstance(id, type, socketId) {
    return new _CLASSES.appUser(id, type, socketId, true);
}
// 
async function getNotificationFullData(userId) {
    let patientData = await _DB.getPatientPreConsultationDataById(userId);
    if (patientData != null) {
        let insertedNotificationData = await _DB.getLastInsertedNotification(userId);
        if (insertedNotificationData != null) {
            return {
                index: insertedNotificationData.ID_PRECONS,
                name: patientData.nom,
                date: insertedNotificationData.DATE_CREATION,
                matricule: userId,
                age: patientData.age,
                numeroTel: patientData.tel,
                motif: insertedNotificationData.MOTIF,
                atcds: insertedNotificationData.ATCD,
                nbJourApporte: insertedNotificationData.NB_JOUR_A,
                files: ["null"]
            }
        }
    }
}
// 
async function getNotificationsForMedecin(medecinId) {
    let notifications = await _DB.notificationsByMedecin(medecinId);
    let fullNotifications = [];
    if (notifications != null) {
        for (let i = 0; i < notifications.length; i++) {
            fullNotifications.push(await getNotificationFullData(notifications[i].MATRICULE_PAT));
        }
    } else
        console.log('getNotificationsForMedecin() | no notifications were found !');
    // 
    return fullNotifications;
}
// 
// 
// 
// ROUTES
__APP.get('/', (req, res) => {
    res.sendFile(__PATH.join(__dirname, 'public', 'html', 'index.html'));
});
// 
__APP.get('/login', (req, res) => {
    res.sendFile(__PATH.join(__dirname, 'public', 'html', 'identification.html'));
});
// 
__APP.get('/medecin/notifications', (req, res) => {
    res.sendFile(__PATH.join(__dirname, 'public', 'html', 'medecinNotifications.html'));
});
__APP.get('/medecin/contact', (req, res) => {
    res.sendFile(__PATH.join(__dirname, 'public', 'html', 'medecinChat.html'));
});
__APP.get('/patient/form', (req, res) => {
    res.sendFile(__PATH.join(__dirname, 'public', 'html', 'patientForm.html'));
});
__APP.get('/patient/contact', (req, res) => {
    res.sendFile(__PATH.join(__dirname, 'public', 'html', 'patientChat.html'));
});
// 
__APP.post('/userTypeById', async (req, res) => {
    let result = 'null';
    if (req.body.matricule != null)
        result = await _DB.getTypeById(req.body.matricule);
    res.end(result);
});
__APP.post('/listeConsultationFields', async (req, res) => {
    let villes = await _DB.getVilles();
    let proffesionns = await _DB.getDataAll("specialites", '');
    res.end(JSON.stringify({
        villes: villes,
        proffess: proffesionns
    }));
});
__APP.post('/getNotifications', async (req, res) => {
    let result = [];
    if (req.body.matricule != null)
        result = await getNotificationsForMedecin(req.body.matricule);
    res.end(JSON.stringify(result));
});
// __APP.post('/')
// 
// 
//START SERVER
__SERVER.listen(__PORT, '0.0.0.0', () => {
    console.log(`Server started...\nListening on port ${__PORT}\nhttps://localhost:${__PORT}`);
});