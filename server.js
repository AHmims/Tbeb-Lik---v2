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
    // ADAPTED
    socket.on('newUser', async (matricule) => {
        try {
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
                            socket: socket.id,
                            online: true
                        }, existingUser.userId, {
                            table: "appUser",
                            id: "userId"
                        });
                        // 
                        console.log('newUser() | updatingResult => ', updatingResult);
                        // 
                        if (type == 'Patient') {
                            socket.join(existingUser.roomId);
                            console.log('newUser() | patientJoin | roomId => ', existingUser.roomId);
                        }
                    } else {
                        let userInstance = makeUserInstance(matricule, type, socket.id);
                        console.log('newUser() | userInstance => ', userInstance);
                        let insertResult = await _DB.insertData(userInstance);
                        console.log('newUser() | insertResult => ', insertResult);
                        // GET THE ROOM ID FROM THE INSERTED USER
                        //IF IT WAS A PATIENT
                        if (type == 'Patient') {
                            let insertedPatient = await _DB.getDataAll('appUser', `where userId = '${matricule}'`);
                            if (insertedPatient.length > 0) {
                                socket.join(insertedPatient[0].roomId);
                                console.log('newUser() | patientJoin | roomId => ', insertedPatient[0].roomId);
                            } else {
                                throw 'newUser() getDataAll returned Empty';
                            }
                        }
                    }
                } else {
                    throw 'newUser() | type = null';
                }
            } else {
                console.log('newUser() | matricule == null');
                throw 'newUser() | matricule = null';
            }
        } catch (err) {
            socket.emit('platformFail');
        }
    });
    // ADAPTED
    socket.on('sendNotif', async data => {
        try {
            console.log('------');
            console.log('sendNotif() | receivedData => ', data);
            // GET USERID FROM SOCKET
            let appUserData = await _DB.getAppUserCustomDataBySocket(["userId"], socket.id);
            console.log('sendNotif() | appUserData => ', appUserData);
            if (appUserData != null) {
                // CHECK IF THE PATIENT GOT ANY ONGOING DEMANDES
                let exists = await _DB.consultationCheck(appUserData.userId);
                console.log('sendNotif() | exists => ', exists);
                if (!exists) {
                    // v2 => GET ONLINE DOCTORS FROM THE GIVEN CITY AND PROFESSIONS
                    // V3 => I'LL HARD CODE THE CITY PARAM VALUE SINCE WE DON'T KNOW YET IF
                    // WE NEED TO SELECT BY CITY OR NOT
                    // let listMedecins = await _DB.getOnlineMedecinsWithCityAndProffession(data.ville, data.proffession);
                    let listMedecins = await _DB.getOnlineMedecinsWithCityAndProffession('cityValue', data.proffession);
                    console.log('sendNotif() | listMedecins => ', listMedecins);
                    if (listMedecins != null) {
                        // INSERT DATA INTO TABLE PRECONSULTATION
                        let insertRes = await _DB.insertData(new _CLASSES.preConsultation(null, data.date, '', '', -1, false, appUserData.userId));
                        console.log('sendNotif() | insertData(preConsultation) => ', insertRes);
                        // SEND NOTIFS TO DOCTORS
                        let notifData = await getNotificationFullData(appUserData.userId);
                        listMedecins.forEach(async medecin => {
                            // console.log('sendNotif() | inboxInsertResult => ', inboxInsertResult);
                            __HUB.to(`/medecinHub#${medecin.socket}`).emit('receivedNotification', notifData);
                        });
                        //SEND FEEDBACK TO THE SENDER
                        __IO.to(socket.id).emit('queryResult', {
                            status: 2,
                            data: listMedecins.length
                        });
                        // 
                    } else {
                        //SEND FEEDBACK TO THE SENDER
                        __IO.to(socket.id).emit('queryResult', {
                            status: 0,
                            data: null
                        });
                        console.log('sendNotif() | listMedecins : no doctor found with the given values');
                    }
                } else {
                    // YOU ALREADY HAVE AN ONGOING DEMANDE YOU CAN'T SEND ANYMORE SHIT
                    console.log('sendNotif() | exists : User have ongoing notification');
                    __IO.to(socket.id).emit('queryResult', {
                        status: 1,
                        data: null
                    });
                }
            } else {
                throw 'sendNoti() | appUserData = null';
            }
        } catch (err) {
            socket.emit('platformFail');
        }
    });
    // ADAPTED
    socket.on('acceptNotif', async (notifId, clientDate, comment) => {
        try {
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
                id: 'idPreCons'
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
                        let roomUnlinkMedecin = await unlinkMedecinFromRooms(medecin.userId);
                        console.log('unlinkMedecinFromRooms() | roomUnlinkMedecin => ', roomUnlinkMedecin);
                        // 
                        let patientUpdate = await _DB.customDataUpdate({
                            MATRICULE_MED: medecin.userId
                        }, room.userPatientMatricule, {
                            table: "appUser",
                            id: "userId"
                        });
                        console.log('acceptNotif() | patientUpdate => ', patientUpdate);
                        // 
                        let roomUpdate = await _DB.customDataUpdate({
                            MATRICULE_MED: medecin.userId
                        }, room.roomId, {
                            table: "room",
                            id: "roomId"
                        });
                        console.log('acceptNotif() | roomUpdate => ', roomUpdate);
                        // 
                        let notificationUpdate = await _DB.customDataUpdate({
                            accepted: true
                        }, notifId, {
                            table: "preConsultation",
                            id: "idPreCons"
                        });
                        console.log('acceptNotif() | notificationUpdate => ', notificationUpdate);
                        // 
                        let consultationInsert = await _DB.insertData(new _CLASSES.consultation(-1, clientDate, medecin.userId, comment, notifId));
                        console.log('acceptNotif() | consultationInsert => ', consultationInsert);
                        // SEND A SOCKET BACK TO THE SENDER
                        __IO.to(socket.id).emit('activeNotification', await acceptedMedecinNotifications(medecin.userId));
                        // SEND A PING TO THE PATIENT INFORMING THEM ABOUT THE ACCEPTANCE OF THE NOTIFICATION
                        socket.to(room.ID_ROOM).emit('notificationAccepted');
                    } else {
                        console.log('acceptNotif() | room not found');
                        throw 'acceptNotif() | room not found';
                    }
                } else {
                    console.log('acceptNotif() | medecin not found');
                    throw 'acceptNotif() | medecin not found';
                }
            } else {
                console.log('acceptNotif() | consultation deja accepté');
                socket.emit('notifAlreadyAccepted');
            }
        } catch (err) {
            socket.emit('platformFail');
        }
    });
    // ADAPTED
    socket.on('disconnect', async () => {
        try {
            console.log('--------');
            // let socketId = socket.id;
            let appUserData = await _DB.getAppUserCustomDataBySocket(["userId", "userType", "linkedMedecinMatricule"], socket.id);
            console.log('disconnect() | appUserData => ', appUserData);
            if (appUserData != null) {
                // IF A USER DISCONNECTS SET THEIR STATUS TO OFFLINE
                let updatingResult = await _DB.customDataUpdate({
                    online: false
                }, appUserData.userId, {
                    table: "appUser",
                    id: "userId"
                });
                // 
                let roomId = await getRoomIdFromSocket();
                console.log('disconnect() | roomId => ', roomId);
                socket.to(roomId).emit('liveStreamTerminated');
                // 
                // if (appUserData.TYPE_USER == "Medecin") {
                // unlinkMedecinFromRooms()
                // console.log(`disconnect() | updatingRoomData => `, updatingRoomData);
                // }
                // 
                console.log('disconnect() | updatingResult => ', updatingResult);
            } else {
                console.log('disconnect() | user not found');
                throw 'disconnect() | user not found';
            }
        } catch (err) {
            socket.emit('platformFail');
        }
    });
    // 
    // 
    socket.on('joinChat', async (medecinId, room, patientId) => {
        try {
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
        } catch (err) {
            socket.emit('platformFail');
        }
    });
    // 
    socket.on('sendMsg', async (msg, msgDate) => {
        try {
            let room = await getRoomIdFromSocket();
            if (room != null) {
                // socket.leaveAll();
                // socket.join(room);
                // 
                console.log('sendMsg() | room => ', room);
                msg = await getMsgAdditionalData(msg, msgDate, 'Text', room);
                console.log('sendMsg() | msg => ', msg);
                socket.to(room).emit('receiveMsg', msg); //MESSAGE RECEIVED BY EVERYONE EXCEPT SENDER
                //__CHAT.to(room).emit('receiveMsg', msg); // MESSAGE RECEIVED BY EVERYONE INCLUDIG SENDER
                // SAVE MSG IN DB
                let insertResult = await _DB.insertData(msg);
                console.log('sendMsg() | insertResult => ', insertResult);
            } else {
                console.log('sendMsg() | room not found');
                throw 'sendMsg() | room not found'
            }
        } catch (err) {
            socket.emit('platformFail');
        }
    });
    // 
    async function getMsgAdditionalData(msgTxt, date, type, room = null) {
        try {
            let msgObject = new _CLASSES.message(null, msgTxt, room, date, type, null);
            // 
            let retData = await _DB.getAppUserCustomDataBySocket(["ID_USER"], socket.client.id);
            if (retData != null) {
                console.log('getMsgAdditionalData() | retData => ', retData);
                msgObject.MATRICULE_EMETTEUR = retData.ID_USER;
                return msgObject;
            } else {
                console.log('getMsgAdditionalData() | retData = null');
                throw 'getMsgAdditionalData() | retData = null';
            }
            // 
        } catch (err) {
            socket.emit('platformFail');
        }

    }
    // 
    socket.on('cancelRequest', async (patientId) => {
        try {
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
                    // SEND BACK TO THE SANEDER
                    socket.emit('cancelRequestSuccess');
                } else {
                    throw 'cancelRequest() | NotiicationId = null';
                }
            } else {
                throw 'cancelRequest() | patientId = null';
            }
        } catch (err) {
            socket.emit('platformFail');
        }
    });
    // 
    // VIDEO
    socket.on('liveStreamInitFail', async () => {
        try {
            let roomId = await getRoomIdFromSocket();
            console.log('liveStreamInitFail() | roomId => ', roomId);
            if (roomId != null) {
                socket.to(roomId).emit('patientLinkFailed');
            } else {
                throw 'liveStreamInitFail() | roomId = null';
            }
        } catch (err) {
            socket.emit('platformFail');
        }
    });
    // 
    socket.on('liveStreamLink', async (data) => {
        try {
            let roomId = await getRoomIdFromSocket();
            console.log('liveStreamLink() | roomId => ', roomId);
            if (roomId != null) {
                socket.to(roomId).emit('liveStreamDataFlux', data);
            } else {
                throw 'liveStreamLink() | roomId = null';
            }
        } catch (err) {
            socket.emit('platformFail');
        }
    });
    // 
    socket.on('endCall', async () => {
        try {
            let roomId = await getRoomIdFromSocket();
            console.log('endCall() | roomId => ', roomId);
            if (roomId != null) {
                socket.to(roomId).emit('liveStreamTerminated');
            } else {
                throw 'endCall() | roomId = null';
            }
        } catch (err) {
            socket.emit('platformFail');
        }
    });
    // 
    async function getRoomIdFromSocket() {
        try {
            let dbResult = await _DB.getRoomIdBySocketId(socket.id);
            return dbResult != null ? dbResult : null;
        } catch (err) {
            socket.emit('platformFail');
        }
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
// ADAPTED
function makeUserInstance(id, type, socketId) {
    try {
        return new _CLASSES.appUser(id, type, socketId, true);
    } catch (err) {
        socket.emit('platformFail');
    }
}
// ADAPTED
async function getNotificationFullData(userId) {
    try {
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
            } else {
                throw 'getNotificationFullData() | insertedNotificationData = null';
            }
        } else {
            throw 'getNotificationFullData() | patientData = null';
        }
    } catch (err) {
        console.log(err)
    }
}
// 
async function getNotificationsForMedecin(medecinId) {
    try {
        let notifications = await _DB.notificationsByMedecin(medecinId);
        let fullNotifications = [];
        if (notifications != null) {
            for (let i = 0; i < notifications.length; i++) {
                fullNotifications.push(await getNotificationFullData(notifications[i].MATRICULE_PAT));
            }
        } else {
            console.log('getNotificationsForMedecin() | no notifications were found !');
            // throw 'getNotificationsForMedecin() | notifications = null';
        }
        // 
        return fullNotifications;
    } catch (err) {
        console.log(err);
    }
}
// 
async function acceptedMedecinNotifications(medecinId) {
    try {
        return await _DB.getAcceptedMedecinNotificationsInfos(medecinId);
    } catch (err) {
        console.log(err);
    }
}
// 
async function unlinkMedecinFromRooms(medecinId) {
    try {
        console.log('------');
        return await _DB.customDataUpdate({
            MATRICULE_MED: null
        }, medecinId, {
            table: "room",
            id: "MATRICULE_MED"
        });
    } catch (err) {
        console.log(err);
    }
}
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
    // res.sendFile(__PATH.join(__dirname, 'public', 'html', 'patientChat-barebones.html'));
});
// 
__APP.post('/userTypeById', async (req, res) => {
    try {
        let result = 'null';
        if (req.body.matricule != null)
            result = await _DB.getTypeById(req.body.matricule);
        console.log('/userTypeById | result => ', result);
        res.end(result);
    } catch (err) {
        res.end('platformFail');
    }
});
__APP.post('/listeConsultationFields', async (req, res) => {
    try {
        console.log('******');
        let villes = await _DB.getVilles();
        console.log('/listeConsultationFields | villes => ', villes);
        let proffess = await _DB.getDataAll("specialites", '');
        console.log('/listeConsultationFields | proffess => ', proffess);
        res.end(JSON.stringify({
            villes: villes,
            proffess: proffess
        }));
    } catch (err) {
        res.end('platformFail');
    }
});
__APP.post('/getNotifications', async (req, res) => {
    try {
        let result = [];
        if (req.body.matricule != null)
            result = await getNotificationsForMedecin(req.body.matricule);
        console.log('/getNotifications | result => ', result);
        res.end(JSON.stringify(result));
    } catch (err) {
        res.end('platformFail');
    }

});
__APP.post('/getMedecinActiveNotifs', async (req, res) => {
    try {
        console.log('******');
        let retData = [];
        if (req.body.matricule != null)
            retData = await acceptedMedecinNotifications(req.body.matricule);
        console.log('/getMedecinActiveNotifs | retData => ', retData);
        res.end(JSON.stringify(retData));
    } catch (err) {
        res.end('platformFail');
    }

});
__APP.post('/getAccessNotif', async (req, res) => {
    try {
        console.log('******');
        let retData = false;
        if (req.body.matricule != null)
            retData = await _DB.checkPatientActiveNotifsExistance(req.body.matricule);
        console.log('/getAccessNotif | retData => ', retData);
        res.end(retData.toString());
    } catch (err) {
        res.end('platformFail');
    }

});
__APP.post('/getMesssages', async (req, res) => {
    try {
        console.log('******');
        let retData = [];
        if (req.body.matricule != null) {
            let room = await _DB.getDataAll('room', `where MATRICULE_PAT = '${req.body.matricule}' or MATRICULE_MED = '${req.body.matricule}'`);
            if (room.length > 0) {
                room = room[0];
                if (req.body.room.length > 0 && req.body.room != null)
                    room.ID_ROOM = req.body.room;
                console.log(`/getMesssages | room => `, room);
                if (Object.keys(room).length > 0) {
                    let msgs = await _DB.getDataAll('message', `where ID_ROOM = '${room.ID_ROOM}' order by ID_MESSAGE asc ,DATE_ENVOI asc`);
                    if (msgs.length > 0)
                        retData = msgs;
                    else {
                        console.log('/getMesssages | msgs = no messages !');
                    }
                } else {
                    console.log('/getMesssages | room not found');
                    throw 'No room was found';
                }
            } else {
                console.log('/getMesssages | no room was found');
                throw 'No room was found';
            }
        } else {
            console.log('/getMesssages | matricule = null');
            throw 'Matricule invalid';
        }
        res.end(JSON.stringify(retData));
    } catch (err) {
        res.end('platformFail');
    }
});
// 
__APP.post('/getNotYetAcceptedRequest', async (req, res) => {
    try {
        console.log('******');
        let retData = false;
        if (req.body.matricule != null)
            retData = await _DB.getNotacceptedYetNotifs(req.body.matricule);
        console.log('/getNotYetAcceptedRequest | retData => ', retData);
        res.end(retData.toString());
    } catch (err) {
        res.end('platformFail');
    }
});
// 
__APP.post('/finalizeConsultation', async (req, res) => {
    try {
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
    } catch (err) {
        res.end('platformFail');
    }
});
// 
__APP.post('/medecinChatBasicData', async (req, res) => {
    try {
        console.log('123456789123456789');
        let retData = [];
        if (req.body.matricule != null) {
            let data = await _DB.getMedecinNameWithConsul(req.body.matricule);
            if (data != null)
                retData = [data];
            else {
                console.log('/medecinChatBasicData | data = no data ?!');
            }
        } else {
            console.log('/medecinChatBasicData | matricule = null');
            throw 'Matricule invalid';
        }
        res.end(JSON.stringify(retData));
    } catch (err) {
        console.log(err);
        res.end('platformFail');
    }

});
// 
//START SERVER
__SERVER.listen(__PORT, '0.0.0.0', () => {
    console.log(`Server started...\nListening on port ${__PORT}\nhttps://localhost:${__PORT}`);
});