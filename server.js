//PACKAGES DECLARATION
const __FS = require('fs');
const __EXPRESS = require('express');
const __APP = __EXPRESS();
const __SERVER = require('http').createServer(__APP);
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
__APP.use(__EXPRESS.static(__dirname));
__APP.use(__EXPRESS.static(__PATH.join(__dirname, 'public')));
// 
// NOTIICATIONS SYSTEM NAMESPACE
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
                    if (type == 'Patient') {
                        socket.join(existingUser.ID_ROOM);
                        console.log('§§§§§§§§§§§§PATIENT ROOMID =>', existingUser.ID_ROOM);
                    }
                } else {
                    let userInstance = makeUserInstance(matricule, type, socket.id);
                    console.log('newUser() | userInstance => ', userInstance);
                    let insertResult = await _DB.insertData(userInstance);
                    console.log('newUser() | insertResult => ', insertResult);
                    // GET THE ROOM ID FROM THE INSERTED USER
                    //IF IT WAS A PATIENT
                    if (type == 'Patient') {
                        let insertedPatient = await _DB.getDataAll('appUser', `where ID_USER = '${matricule}'`);
                        if (insertedPatient.length > 0) {
                            socket.join(insertedPatient[0].ID_ROOM);
                            console.log('§§§§§§§§§§§§PATIENT ROOMID =>', insertedPatient[0].ID_ROOM);
                        }
                    }
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
                    // 
                    console.log('acceptNotif() | room => ', room);
                    // REMOVE ME FROM ROOMS
                    let roomUnlinkMedecin = await unlinkMedecinFromRooms(medecin.ID_USER);
                    console.log('unlinkMedecinFromRooms() | roomUnlinkMedecin => ', roomUnlinkMedecin);
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
                    // SEND A SOCKET BACK TO THE SENDER
                    __IO.to(socket.id).emit('activeNotification', await acceptedMedecinNotifications(medecin.ID_USER));
                    // SEND A PING TO THE PATIENT INFORMING THEM ABOUT THE ACCEPTANCE OF THE NOTIFICATION
                    socket.to(room.ID_ROOM).emit('notificationAccepted');
                } else
                    console.log('acceptNotif() | room not found');
            } else
                console.log('acceptNotif() | medecin not found');
        } else
            console.log('acceptNotif() | consultation deja accepté');
    });
    socket.on('disconnect', async () => {
        console.log('--------');
        // let socketId = socket.id;
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
            // if (appUserData.TYPE_USER == "Medecin") {
            // unlinkMedecinFromRooms()
            // console.log(`disconnect() | updatingRoomData => `, updatingRoomData);
            // }
            // 
            console.log('disconnect() | updatingResult => ', updatingResult);
        }
    });
    // 
    // 
    socket.on('joinChat', async (medecinId, room, patientId) => {
        console.log('#-#-#-#');
        let roomUnlinkMedecin = await unlinkMedecinFromRooms(medecinId);
        console.log('joinChat() | roomUnlinkMedecin => ', roomUnlinkMedecin);
        let patientUpdate = await _DB.customDataUpdate({
            MATRICULE_MED: medecinId
        }, patientId, {
            table: "room",
            id: "MATRICULE_PAT"
        });
        console.log('unlinkMedecinFromRooms() | patientUpdate => ', patientUpdate);
        // 
        // socket.leaveAll();
        socket.join(room);
    });
    // 
    socket.on('sendMsg', async msg => {
        let room = await getRoomIdFromSocket();
        if (room != null) {
            // socket.leaveAll();
            // socket.join(room);
            // 
            console.log('sendMsg() | room => ', room);
            msg = await getMsgAdditionalData(msg, 'Text', room);
            console.log('sendMsg() | msg => ', msg);
            socket.to(room).emit('receiveMsg', msg); //MESSAGE RECEIVED BY EVERYONE EXCEPT SENDER
            //__CHAT.to(room).emit('receiveMsg', msg); // MESSAGE RECEIVED BY EVERYONE INCLUDIG SENDER
            // SAVE MSG IN DB
            let insertResult = await _DB.insertData(msg);
            console.log('sendMsg() | insertResult => ', insertResult);
        } else console.log('sendMsg() | room not found');
    });
    // 
    async function getMsgAdditionalData(msgTxt, type, room = null) {
        let msgObject = new _CLASSES.message(null, msgTxt, room, new Date(Date.now()), type, null);
        // 
        let retData = await _DB.getAppUserCustomDataBySocket(["ID_USER"], socket.client.id);
        if (retData != null) {
            console.log('getMsgAdditionalData() | retData => ', retData);
            msgObject.MATRICULE_EMETTEUR = retData.ID_USER;
        } else
            console.log('getMsgAdditionalData() | retData = null ');
        // 
        return msgObject;
    }
    // 
    socket.on('cancelRequest', async (patientId) => {
        let nId = null;
        console.log('cancelRequest() | patientId => ', patientId);
        if (patientId != null) {
            nId = await _DB.getLastInsertedNotification(patientId);
            console.log('cancelRequest() | nId => ', nId);
            if (nId != null) {
                nId = nId.ID_PRECONS;
                let deleteFromPreConsultation = await _DB.customDataDelete({
                    table: "preConsultation",
                    id: "ID_PRECONS"
                }, nId);
                console.log(`cancelRequest() | deleteFromPreConsultation => `, deleteFromPreConsultation);
                // 
                let deleteFromMedecinInbox = await _DB.customDataDelete({
                    table: "medecinInbox",
                    id: "ID_PRECONS"
                }, nId);
                console.log(`cancelRequest() | deleteFromMedecinInbox => `, deleteFromMedecinInbox);
                // 
                __HUB.emit('removeNotificationBox', nId);
                // SEND BACK TOTHE SANEDER
                socket.emit('cancelRequestSuccess');
            }
        }

    });
    // 
    // 
    // VIDEO
    socket.on('liveStreamInitFail', async () => {
        let roomId = await getRoomIdFromSocket();
        console.log('liveStreamInitFail() | roomId => ', roomId);
        socket.to(roomId).emit('patientLinkFailed');
    });
    // 
    socket.on('liveStreamLink', async (data) => {
        let roomId = await getRoomIdFromSocket();
        console.log('liveStreamLink() | roomId => ', roomId);
        socket.to(roomId).emit('liveStreamDataFlux', data);
    });
    // 
    socket.on('endCall', async () => {
        let roomId = await getRoomIdFromSocket();
        console.log('endCall() | roomId => ', roomId);
        socket.to(roomId).emit('liveStreamTerminated');
    });
    // 
    async function getRoomIdFromSocket() {
        let dbResult = await _DB.getRoomIdBySocketId(socket.id);
        return dbResult != null ? dbResult : null;
    }
});
// 
__HUB.on('connection', socket => {
    console.log('------');
    console.log('Hub/connection doctorConnected => ', socket.id);
    // 
    socket.on('acceptNotif', (nId) => {
        __HUB.emit('removeNotificationBox', nId);
    });
});
// 
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
async function acceptedMedecinNotifications(medecinId) {
    return await _DB.getAcceptedMedecinNotificationsInfos(medecinId);
}
// 
async function unlinkMedecinFromRooms(medecinId) {
    console.log('------');
    return await _DB.customDataUpdate({
        MATRICULE_MED: null
    }, medecinId, {
        table: "room",
        id: "MATRICULE_MED"
    });
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
    // console.log(req.query.room);
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
    console.log('******');
    let villes = await _DB.getVilles();
    console.log('/listeConsultationFields | villes => ', villes);
    let proffess = await _DB.getDataAll("specialites", '');
    console.log('/listeConsultationFields | proffess => ', proffess);
    res.end(JSON.stringify({
        villes: villes,
        proffess: proffess
    }));
});
__APP.post('/getNotifications', async (req, res) => {
    let result = [];
    if (req.body.matricule != null)
        result = await getNotificationsForMedecin(req.body.matricule);
    res.end(JSON.stringify(result));
});
__APP.post('/getMedecinActiveNotifs', async (req, res) => {
    console.log('******');
    let retData = [];
    if (req.body.matricule != null)
        retData = await acceptedMedecinNotifications(req.body.matricule);
    res.end(JSON.stringify(retData));
});
__APP.post('/getAccessNotif', async (req, res) => {
    console.log('******');
    let retData = false;
    if (req.body.matricule != null)
        retData = await _DB.checkPatientActiveNotifsExistance(req.body.matricule);
    res.end(retData.toString());
});
__APP.post('/getMesssages', async (req, res) => {
    console.log('******');
    let retData = [];
    if (req.body.matricule != null) {
        let room = await _DB.getDataAll('room', `where MATRICULE_PAT = '${req.body.matricule}' or MATRICULE_MED = '${req.body.matricule}'`);
        room = room[0];
        if (req.body.room.length > 0)
            room.ID_ROOM = req.body.room;
        console.log(`getMesssages() | room => `, room);
        if (Object.keys(room).length > 0) {
            let msgs = await _DB.getDataAll('message', `where ID_ROOM = '${room.ID_ROOM}' order by DATE_ENVOI asc`);
            if (msgs.length > 0)
                retData = msgs;
            else console.log('/getMesssages | msgs = no messages !');
        } else console.log('/getMesssages | room not found');
    } else console.log('/getMesssages | matricule = null');
    res.end(JSON.stringify(retData));
});
// 
__APP.post('/getNotYetAcceptedRequest', async (req, res) => {
    console.log('******');
    let retData = false;
    if (req.body.matricule != null)
        retData = await _DB.getNotacceptedYetNotifs(req.body.matricule);
    res.end(retData.toString());
});
// 
__APP.post('/finalizeConsultation', async (req, res) => {
    let status = false;
    let notifId = await _DB.getNotifIdByRoomId(req.body.room, req.body.matricule);
    console.log(`finalizeConsultation() | notifId => `, notifId);
    if (notifId != null) {
        let consultationFinished = await _DB.customDataUpdate({
            JOUR_REPOS: 1
        }, notifId, {
            table: "consultation",
            id: "ID_PRECONS"
        });
        console.log('finalizeConsultation() | consultationFinished => ', consultationFinished);
        // 
        status = Boolean(consultationFinished);
    }
    // 
    res.end(status.toString());
});
// __APP.post('/')
// 
// 
//START SERVER
__SERVER.listen(__PORT, '0.0.0.0', () => {
    console.log(`Server started...\nListening on port ${__PORT}\nhttps://localhost:${__PORT}`);
});