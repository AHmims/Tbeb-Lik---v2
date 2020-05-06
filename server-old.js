//PACKAGES DECLARATION
var _ = require('lodash');
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
const __PORT = 8080;
//MIDDLEWARES
__APP.use(__EXPRESS.urlencoded({
    extended: true
}));
__APP.use(__EXPRESS.json());
__APP.use(__EXPRESS.static(__PATH.join(__dirname, 'public')));
//TRAITMENT
__IO.on('connection', socket => {
    // data = {motif : "",atcd : "",nbJourA : ""}
    socket.on('newNotif', async data => {
        let user = await _DB.getAppUserCustomDataBySocket(["userId"], `/chat#${socket.id}`);
        if (user != null) {
            let exists = await _DB.consultationCheck(user.userId);
            if (!exists) {
                let insertRes = await _DB.insertData(new _CLASSES.preConsultation(null, null, data.motif, data.atcd, data.nbJourA, false, user.userId));
                // console.log(`Preconsultation Insert => ${insertRes}`);
                // 
                // console.log('')
                let notifData = await getNotificationFullData(user.userId);
                __HUB.emit('getNotifs', [notifData]);
            } else
                console.log('HoldOn before you send a preconsultation');
        }
    });
    socket.on('disconnect', () => {
        // console.log('Socket off');
    });
    // 
});
// NAMEPSACES
const __CHAT = __IO.of('/chat');
const __HUB = __IO.of('/medecinHub');
// CHAT
__CHAT.on('connection', socket => {
    socket.on('setPatient', async patientId => {
        // console.log(patientId);
        let userInstance = setUserSocket('Patient', socket, patientId);
        // 
        let exsistingUser = await _DB.getAppUserDataById(userInstance.userId);
        // 
        if (exsistingUser != null) {
            let updatingResult = await _DB.customDataUpdate({
                socket: socket.id,
                online: true
            }, exsistingUser.userId, {
                table: "appUser",
                id: "userId"
            });
            // 
            socket.join(exsistingUser.roomId);
            // 
            if (exsistingUser.linkedMedecinMatricule != null)
                await getPatientList(exsistingUser.linkedMedecinMatricule, userInstance.userId);
        }
        // 
        else {
            let insertResult = await _DB.insertData(userInstance);
            socket.join(userInstance.roomId);
        }
    });
    // 
    socket.on('setMedecin', async medecinId => {
        let userInstance = setUserSocket('Medecin', socket, medecinId);
        // 
        let exsistingUser = await _DB.getAppUserDataById(userInstance.userId);
        // 
        if (exsistingUser != null) {
            let updatingResult = await _DB.customDataUpdate({
                socket: socket.id,
                online: true
            }, exsistingUser.userId, {
                table: "appUser",
                id: "userId"
            });
        }
        // 
        else {
            let insertResult = await _DB.insertData(userInstance);
        }
        let resultRow = await _DB.selectFirstConsultationForChat(medecinId);
        if (resultRow != null) {
            let notifId = resultRow.idPreCons;
            let roomData = await _DB.getRoomIdByNotifId(notifId);
            if (roomData != null) {
                let dbPatientUpdate = await _DB.customDataUpdate({
                    userMedecinMatricule: medecinId
                }, resultRow.MATRICULE_PAT, {
                    table: "room",
                    id: "userPatientMatricule"
                });
                // console.log('dbPatientUpdate => ', dbPatientUpdate);
                socket.join(roomData.roomId);
            }
        }
    });
    // 
    socket.on('disconnect', async () => {
        let retData = await _DB.getAppUserCustomDataBySocket(["userId", "userType", "linkedMedecinMatricule"], socket.id);
        if (retData != null) {
            // IF A USER DISCONNECTS SET THEIR STATUS TO OFFLINE
            let updatingResult = await _DB.customDataUpdate({
                online: false
            }, retData.userId, {
                table: "appUser",
                id: "userId"
            });
            // WHEN A PATIENT DISCONNECTS SEND A REQUEST TO REFRESH THE CORRESPONDING
            // MEDECIN PATIENTS LIST 
            if (retData.userType == 'Patient') {
                getPatientList(retData.linkedMedecinMatricule, retData.userId);
            } else
                removeMeFromEveryInstanceSoThatThingsWontBreakLater(retData.userId);
            // 
        }
    });
    // 
    socket.on('joinRoom', async (notificationId, date = new Date(Date.now())) => {
        let functionData = await joiningRoom(notificationId, date);
        let roomId = functionData.roomId;
        // 
        removeMeFromEveryInstanceSoThatThingsWontBreakLater();

        if (roomId != null)
            socket.join(roomId);
        // else
        // console.log('joinRoom => roomId == null');
        // 
        let dbRes = await _DB.getAppUserCustomDataBySocket(["userId"], socket.id);
        var medecinId = dbRes != null ? dbRes.userId : null;
        // 
        if (medecinId != null) {
            if (roomId != null) {
                let tempRoom = await _DB.getRoomDataById(roomId);
                // 
                let dbPatientUpdate = await _DB.customDataUpdate({
                    linkedMedecinMatricule: medecinId
                }, tempRoom.userPatientMatricule, {
                    table: "appUser",
                    id: "userId"
                });
                // console.log('dbPatientUpdate => ' + dbPatientUpdate);
                // 
                let updatedRoomLinkedMedecin = await _DB.customDataUpdate({
                    userMedecinMatricule: medecinId
                }, roomId, {
                    table: "room",
                    id: "roomId"
                });
                // console.log('updatedRoomLinkedMedecin => ' + updatedRoomLinkedMedecin);
                // 
                let exists = await _DB.checkExistence({
                    table: 'consultation',
                    id: 'idPreCons'
                }, notificationId);
                let dbInsertRet = 0;
                if (!exists)
                    dbInsertRet = await _DB.insertData(new _CLASSES.consultation(-1, date, medecinId, '', notificationId));
                // console.log('dbInsertRet =>  : ' + dbInsertRet);
                // 

            }
        }
    });
    // 
    socket.on('msgSent', async (msg) => {
        let room = await getRoomIdFromSocket();
        // 
        if (room != null) {
            msg = await getMsgAdditionalData(msg, 'Text');
            // console.log(msg);
            socket.to(room).emit('msgReceived', msg); //MESSAGE RECEIVED BY EVERYONE EXCEPT SENDER
            //__CHAT.to(room.roomId).emit('msgReceived', msg); // MESSAGE RECEIVED BY EVERYONE INCLUDIG SENDER
        }
    });
    // 
    // VIDEO
    socket.on('liveStreamInitFail', async () => {
        let roomId = await getRoomIdFromSocket();
        // console.log('liveStreamInitFail()');
        socket.to(roomId).emit('patientLinkFailed');
    });
    // 
    socket.on('liveStreamLink', async (data) => {
        let roomId = await getRoomIdFromSocket();
        // console.log('liveStreamLink() => ');
        socket.to(roomId).emit('liveStreamDataFlux', data);
    });
    // 
    socket.on('endCall', async () => {
        let roomId = await getRoomIdFromSocket();
        // console.log('liveStreamLink() => ');
        socket.to(roomId).emit('liveStreamTerminated');
    });
    //
    //  
    // 
    function setUserSocket(type, socket, id) {
        return new _CLASSES.appUser(id, type, socket.id, true);
    }
    // 
    async function getPatientList(medecinId, patientId) {
        // let patientByMedecin = await _DB.getChatPatients(medecinId, `AND a.userId = '${patientId}'`);
        // let medecinSocketId = await _DB.getAppUserCustomData(["socket"], medecinId);
        // socket.to(medecinSocketId.socket).emit('p_liste', patientByMedecin);
        // 
        let appUsersPatients = await _DB.getAppUserPatientsByMedecinId(medecinId);
        //
        for (let i = 0; i < appUsersPatients.length; i++) {
            let pholder = Object.values(appUsersPatients[i]);
            let objectClass = new _CLASSES.appUser(...pholder);
            let refinedObject = objectClass.getStatus();
            // 
            refinedObject.idPreCons = null;
            // 
            let userNotifications = await _DB.getNotificationDataByPatientId(refinedObject.userId, 0);
            // 
            userNotifications.forEach(notif => {
                if (notif.MATRICULE_PAT == refinedObject.userId)
                    refinedObject.idPreCons = notif.idPreCons;
            });
            // 
            refinedObject.nom = `${appUsersPatients[i].NOM_PAT} ${appUsersPatients[i].Prenom_PAT}`;
            // 
            appUsersPatients[i] = refinedObject;
        }
        let medecinSocketId = await _DB.getAppUserCustomData(["socket"], medecinId);
        // console.log(medecinSocketId.socket);
        // console.log(appUsersPatients);
        if (appUsersPatients.length > 0) {
            // console.log('getPatientList() => ', appUsersPatients);
            socket.to(medecinSocketId.socket).emit('p_liste', appUsersPatients);
        }
    }
    // 
    async function getMsgAdditionalData(msgTxt, type) {
        let msgObject = new _CLASSES.message(null, msgTxt, null, new Date(Date.now()), type, null);
        msgObject.roomId = await getRoomIdFromSocket();
        // 
        if (msgObject.roomId != null) {
            let retData = await _DB.getAppUserCustomDataBySocket(["userId"], socket.id);
            // 
            msgObject.Matricule_emmeter = retData.userId;
            // 
        }
        return msgObject;
    }
    // 
    async function joiningRoom(nId, date = null) {
        let dbResult = await _DB.getRoomIdByNotifId(nId);
        // 
        // console.log('dbResult =>', dbResult);
        // 
        let retData = {
            roomId: dbResult != null ? dbResult.roomId : null,
            arrayIndex: -1
        }
        // 
        if (!Boolean(dbResult.accepted) && retData.roomId != null)
            socket.to(retData.roomId).emit('newNotification', date, false, nId);
        // 
        let updateState = await _DB.customDataUpdate({
            accepted: true
        }, nId, {
            table: "preConsultation",
            id: "idPreCons"
        })
        retData.arrayIndex = -1;
        // 
        return retData;
    }
    // 
    async function getRoomIdFromSocket() {
        let dbResult = await _DB.getRoomIdBySocketId(socket.id);
        return dbResult != null ? dbResult.roomId : null;
    }
    // 
    async function removeMeFromEveryInstanceSoThatThingsWontBreakLater(userId) {
        let room = await _DB.getRoomId("userMedecinMatricule", userId);
        // 
        if (room != null) {
            let updatingResult = await _DB.customDataUpdate({
                userMedecinMatricule: null
            }, room.roomId, {
                table: "room",
                id: "roomId"
            });
            // STOP STREAM FLUX
            socket.to(room.roomId).emit('liveStreamTerminated');
        }
        // 
        socket.leaveAll();
    }
    // 
});
// NOTIICATION SYSTEM
__HUB.on('connection', socket => {
    socket.on('updateNotif', (notifId) => {
        __HUB.emit('notifAccepted', notifId);
    });
});
// GLOBAL FUNCTIONS
async function getNotificationFullData(userId) {
    let patientData = await _DB.getPatientPreConsultationDataById(userId);
    if (patientData != null) {
        let insertedNotificationData = await _DB.getLastInsertedNotification(userId);
        if (insertedNotificationData != null) {
            return {
                index: insertedNotificationData.idPreCons,
                name: patientData.nom,
                date: insertedNotificationData.dateCreation,
                matricule: userId,
                age: patientData.age,
                numeroTel: patientData.tel,
                motif: insertedNotificationData.motif,
                atcds: insertedNotificationData.atcd,
                nbJourApporte: insertedNotificationData.nbJourA,
                files: ["null"]
            }
        }
    }
}
async function getNotifications() {
    let notifications = await _DB.getDataAll('preConsultation', 'WHERE accepted = FALSE');
    if (notifications != null) {
        let retData = [];
        for (let i = 0; i < notifications.length; i++) {
            let fullNotif = await getNotificationFullData(notifications[i].MATRICULE_PAT);
            retData.push(fullNotif);
        }
        return retData;
    } else return [];
}
// 
// 
// ROUTES
__APP.get('/', (req, res) => {
    res.sendFile(__PATH.join(__dirname, 'public', 'html', 'ocp_login.html'));
});
__APP.get('/m', (req, res) => {
    res.sendFile(__PATH.join(__dirname, 'public', 'html', 'medecin.html'));
});
__APP.get('/p', (req, res) => {
    res.sendFile(__PATH.join(__dirname, 'public', 'html', 'patient.html'));
});
// 
__APP.get('/medecin/notifications', (req, res) => {
    res.sendFile(__PATH.join(__dirname, 'public', 'html', 'ocp_medecin_page1.html'));
});
__APP.get('/medecin/contact', (req, res) => {
    res.sendFile(__PATH.join(__dirname, 'public', 'html', 'ocp_medecin_page2.html'));
});
__APP.get('/patient/form', (req, res) => {
    res.sendFile(__PATH.join(__dirname, 'public', 'html', 'ocp_patient_formulaire.html'));
});
__APP.get('/patient/contact', (req, res) => {
    res.sendFile(__PATH.join(__dirname, 'public', 'html', 'ocp_patient_contact.html'));
});
// 
// 
__APP.post('/getActivePatients', async (req, res) => {
    let medecinId = req.body.medecinId;
    // 
    let patientsByMedecin = await _DB.getChatPatients(medecinId, '');
    // 
    res.end(JSON.stringify(patientsByMedecin));
});
// 
__APP.post('/finalizeCase', async (req, res) => {
    // KHTASR HD LKHRA LATER ON
    let roomId = await _DB.getRoomId("userMedecinMatricule", req.body.userId);
    let roomData = await _DB.getRoomDataById(roomId.roomId);
    let notif = await _DB.getNotificationDataByPatientId(roomData.userPatientMatricule, 1);
    if (notif != null) {
        let consultationFinished = await _DB.customDataUpdate({
            commentaire: req.body.cmmnt,
            JOUR_REPOS: req.body.data.nbrJV
        }, notif[0].idPreCons, {
            table: "consultation",
            id: "idPreCons"
        });
        // 
        let preConsultationUpdate = await _DB.customDataUpdate({
            nbJourA: req.body.data.nbrJA
        }, notif[0].idPreCons, {
            table: "preConsultation",
            id: "idPreCons"
        });
        // console.log('consultationFinished => ', consultationFinished);
    }
    // 
    var state = false;
    // 
    let data = req.body.data;
    let extraData = await _DB.getPatientDoculentDataFromMedecinId(req.body.userId);
    // console.log('extraData => ', extraData);
    if (extraData != null) {
        let finalData = {
            ...data,
            ...extraData
        };
        // 
        state = await __PDF.makeDoc(finalData);
    }
    // 
    res.end(state.toString());
});
// 
__APP.post('/getNotifications', async (req, res) => {
    let data = await getNotifications();
    res.end(JSON.stringify(data));
});
// 
__APP.post('/linkWithMedecin', async (req, res) => {
    // console.log(req.body.notif);
    let data = await _DB.getNotificationdata(req.body.notif);
    // console.log(data);
    if (data != null) {
        if (data.accepted == 1) {
            let dateNow = new Date(Date.now());
            let notifDate = new Date(data.DATE_CONSULTATION);
            if (notifDate - dateNow <= 0) {
                // console.log('notifDate - dateNow <= 0');
                res.end('true');
            } else {
                if (data.JOUR_REPOS > -1)
                    res.end('Votre cas a ete traité');
                else
                    res.end('false');
            }
        } else res.end('Champ non clickable');
    } else
        res.end('Erreur');
});
// 
__APP.post('/getPatientNotifications', async (req, res) => {
    let result = await _DB.getAllPatientNotification(req.body.matricule);
    res.end(JSON.stringify(result));
});
// 
__APP.post('/getMyData', async (req, res) => {
    let result = await _DB.getPatientDataById(req.body.id);
    res.end(JSON.stringify(result));
})
// 
//START SERVER
__SERVER.listen(__PORT, '0.0.0.0', () => {
    console.log(`Server started...\nListening on port ${__PORT}\nhttps://localhost:${__PORT}`);
});