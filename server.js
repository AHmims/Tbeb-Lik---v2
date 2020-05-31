//PACKAGES DECLARATION
const __FS = require('fs');
const __EXPRESS = require('express');
const __APP = __EXPRESS();
const __SERVER = require('http').createServer(__APP);
const __IO = require('socket.io')(__SERVER);
const __PATH = require('path');
const __JWT = require('jsonwebtoken');
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
__APP.use('/login', async (req, res, next) => {
    try {
        const _AUTH_TOKEN = req.query.auth;
        if (_AUTH_TOKEN == undefined || _AUTH_TOKEN == null)
            return next();
        else {
            let userData = await decodeAndFetchUser(_AUTH_TOKEN);
            if (userData == null)
                return next();
            else {
                let redirectUrl = '/login';
                switch (userData.type) {
                    case 'Patient':
                        redirectUrl = '/patient/form';
                        break;
                    case 'Medecin':
                        redirectUrl = '/medecin/notifications';
                        break;
                    default:
                        throw `userType unknown => ${userData.type}`;
                }
                // 
                res.redirect(`${redirectUrl}?auth=${_AUTH_TOKEN}`);
            }
        }
    } catch (err) {
        console.log(err);
    }
});
// __APP.use('/patient/:page', (req, res, next) => {
// res.redirect('/');
// });
// 
// NOTIICATIONS SYSTEM NAMESPACE
const __HUB = __IO.of('/medecinHub');
//TRAITMENT
__IO.on('connection', socket => {
    // ADAPTED
    socket.on('newUser', async (matricule) => {
        console.log('in');
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
            // let appUserData = await _DB.getAppUserCustomDataBySocket(["userId"], socket.id);
            // console.log('sendNotif() | appUserData => ', appUserData);
            if (data.patientId != null) {
                let appUserData = {
                    userId: data.patientId
                };
                // CHECK IF THE PATIENT GOT ANY ONGOING DEMANDES
                let exists = await _DB.consultationCheck(appUserData.userId);
                console.log('sendNotif() | exists => ', exists);
                if (!exists) {
                    // v2 => GET ONLINE DOCTORS FROM THE GIVEN CITY AND PROFESSIONS
                    // V3 => I'LL HARD CODE THE CITY PARAM VALUE SINCE WE DON'T KNOW YET IF
                    // WE NEED TO SELECT BY CITY OR NOT
                    // let listMedecins = await _DB.getOnlineMedecinsWithCityAndProffession(data.ville, data.proffession);
                    // let listMedecins = await _DB.getOnlineMedecinsWithCityAndProffession('cityValue', data.proffession);
                    let listMedecins = await _DB.getToSendToDoctors();
                    console.log('sendNotif() | listMedecins => ', listMedecins);
                    if (listMedecins != null) {
                        // INSERT DATA INTO TABLE PRECONSULTATION
                        let insertRes = await _DB.insertData(new _CLASSES.preConsultation('tempId', data.date, data.motif, data.atcd, data.nbja, false, appUserData.userId));
                        console.log('sendNotif() | insertData(preConsultation) => ', insertRes);
                        // SEND NOTIFS TO DOCTORS
                        let notifData = await getNotificationFullData(appUserData.userId);
                        listMedecins.forEach(async medecin => {
                            let inboxInsertResult = await _DB.insertData(new _CLASSES.medecinInbox(notifData.index, medecin.Matricule_Med));
                            console.log('sendNotif() | inboxInsertResult => ', inboxInsertResult);
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
    socket.on('acceptNotif', async (notifId, clientDate) => {
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
                let medecin = await _DB.getAppUserCustomDataBySocket(["userId"], socket.id);
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
                            linkedMedecinMatricule: medecin.userId
                        }, room.userPatientMatricule, {
                            table: "appUser",
                            id: "userId"
                        });
                        console.log('acceptNotif() | patientUpdate => ', patientUpdate);
                        // 
                        let roomUpdate = await _DB.customDataUpdate({
                            userMedecinMatricule: medecin.userId
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
                        let consultationInsert = await _DB.insertData(new _CLASSES.consultation(-1, clientDate, medecin.userId, '', notifId));
                        console.log('acceptNotif() | consultationInsert => ', consultationInsert);
                        // SEND A SOCKET BACK TO THE SENDER
                        __IO.to(socket.id).emit('activeNotification', await acceptedMedecinNotifications(medecin.userId));
                        // SEND A PING TO THE PATIENT INFORMING THEM ABOUT THE ACCEPTANCE OF THE NOTIFICATION
                        socket.to(room.roomId).emit('notificationAccepted', clientDate);
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
    // ADAPTED
    socket.on('joinChat', async (medecinId, room, patientId) => {
        try {
            console.log('#-#-#-#');
            let roomUnlinkMedecin = await unlinkMedecinFromRooms(medecinId);
            console.log('joinChat() | roomUnlinkMedecin => ', roomUnlinkMedecin);
            let patientUpdate = await _DB.customDataUpdate({
                userMedecinMatricule: medecinId
            }, patientId, {
                table: "room",
                id: "userPatientMatricule"
            });
            console.log('unlinkMedecinFromRooms() | patientUpdate => ', patientUpdate);
            // 
            // socket.leaveAll();
            socket.join(room);
        } catch (err) {
            socket.emit('platformFail');
        }
    });
    // ADAPTED
    socket.on('sendMsg', async (msg, msgDate, msgType, filePath = null) => {
        try {
            let room = await getRoomIdFromSocket();
            if (room != null) {
                // socket.leaveAll();
                // socket.join(room);
                // 
                console.log('sendMsg() | room => ', room);
                msg = await getMsgAdditionalData(msg, msgDate, msgType, filePath, room);
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
    // ADAPTED
    async function getMsgAdditionalData(msgTxt, date, type, filePath, room = null) {
        try {
            let msgObject = new _CLASSES.message(null, msgTxt, room, date, type, filePath);
            // 
            let retData = await _DB.getAppUserCustomDataBySocket(["userId"], socket.client.id);
            if (retData != null) {
                console.log('getMsgAdditionalData() | retData => ', retData);
                msgObject.Matricule_emmeter = retData.userId;
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
    // ADAPTED
    socket.on('cancelRequest', async (patientId) => {
        try {
            let nId = null;
            console.log('cancelRequest() | patientId => ', patientId);
            if (patientId != null) {
                nId = await _DB.getLastInsertedNotification(patientId);
                console.log('cancelRequest() | nId => ', nId);
                if (nId != null) {
                    nId = nId.idPreCons;
                    let deleteFromPreConsultation = await _DB.customDataDelete({
                        table: "preConsultation",
                        id: "idPreCons"
                    }, nId);
                    console.log(`cancelRequest() | deleteFromPreConsultation => `, deleteFromPreConsultation);
                    // 
                    let deleteFromMedecinInbox = await _DB.customDataDelete({
                        table: "medecinInbox",
                        id: "idPreCons"
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
    // ADAPTED
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
// ADAPTED
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
// ADAPTED
async function acceptedMedecinNotifications(medecinId) {
    try {
        return await _DB.getAcceptedMedecinNotificationsInfos(medecinId);
    } catch (err) {
        console.log(err);
    }
}
// ADAPTED
async function unlinkMedecinFromRooms(medecinId) {
    try {
        console.log('------');
        return await _DB.customDataUpdate({
            userMedecinMatricule: null
        }, medecinId, {
            table: "room",
            id: "userMedecinMatricule"
        });
    } catch (err) {
        console.log(err);
    }
}
//
async function decodeAndFetchUser(userToken) {
    try {
        var publicKEY = __FS.readFileSync('./public.key', 'utf8');
        let tokenData = __JWT.verify(userToken, publicKEY, {
            issuer: "3li",
            subject: "Auth tokens",
            audience: 'users',
            expiresIn: "468h",
            algorithm: "RS256"
        });
        return await _DB.authGetUserData(tokenData.id);
        // retdata = {id:"",type:"",nom:""}
    } catch (err) {
        console.log(err);
    }
}
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
    // res.sendFile(__PATH.join(__dirname, 'public', 'html', 'patientForm.html'));
    res.sendFile(__PATH.join(__dirname, 'public', 'html', 'patientFormv2.html'));
});
__APP.get('/patient/contact', (req, res) => {
    res.sendFile(__PATH.join(__dirname, 'public', 'html', 'patientChat.html'));
    // res.sendFile(__PATH.join(__dirname, 'public', 'html', 'patientChat-barebones.html'));
});
// 
// 
// ADAPTED
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
// ADAPTED
__APP.post('/listeConsultationFields', async (req, res) => {
    try {
        console.log('******');
        let villes = await _DB.getVilles();
        console.log('/listeConsultationFields | villes => ', villes);
        let proffess = await _DB.getDataAll("specialites");
        console.log('/listeConsultationFields | proffess => ', proffess);
        res.end(JSON.stringify({
            villes: villes,
            proffess: proffess
        }));
    } catch (err) {
        res.end('platformFail');
    }
});
// ADAPETD
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
// ADAPTED
__APP.post('/getMedecinActiveNotifs', async (req, res) => {
    try {
        console.log('******');
        let retData = [];
        if (req.body.matricule != null) {
            let reqRes = await acceptedMedecinNotifications(req.body.matricule);
            if (reqRes != null)
                retData = reqRes;
        }
        console.log('/getMedecinActiveNotifs | retData => data');
        res.end(JSON.stringify(retData));
    } catch (err) {
        res.end('platformFail');
    }

});
// ADAPTED
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
// ADAPTED
__APP.post('/getMesssages', async (req, res) => {
    try {
        console.log('******');
        let retData = [];
        if (req.body.matricule != null) {
            let room = await _DB.getDataAll('room', `where userPatientMatricule = '${req.body.matricule}' or userMedecinMatricule = '${req.body.matricule}'`);
            if (room.length > 0) {
                room = room[0];
                if (req.body.room.length > 0 && req.body.room != null)
                    room.roomId = req.body.room;
                console.log(`/getMesssages | room => `, room);
                if (Object.keys(room).length > 0) {
                    let msgs = await _DB.getDataAll('message', `where roomId = '${room.roomId}' order by messageId asc ,date_envoi asc`);
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
// ADAPTED
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
// ADAPTED
__APP.post('/finalizeConsultation', async (req, res) => {
    try {
        let status = false;
        let reqRetData = {
            status: false,
            filename: null,
            downloadLink: null
        };
        let notifId = await _DB.getNotifIdByRoomId(req.body.room, req.body.matricule);
        console.log(`finalizeConsultation() | notifId => `, notifId);
        if (notifId != null) {
            let preConsultationFinished = await _DB.customDataUpdate({
                nbJourA: req.body.data.nbrJA
            }, notifId, {
                table: "preConsultation",
                id: "idPreCons"
            });
            console.log('finalizeConsultation() | preConsultationFinished => ', preConsultationFinished);
            if (preConsultationFinished > 0) {
                // 
                let consultationFinished = await _DB.customDataUpdate({
                    JOUR_REPOS: req.body.data.nbrJV,
                    commentaire: req.body.data.cmnt
                    // visa_med: req.body.data.visaM
                }, notifId, {
                    table: "consultation",
                    id: "idPreCons"
                });
                console.log('finalizeConsultation() | consultationFinished => ', consultationFinished);
                if (consultationFinished > 0) {
                    let patientData = await _DB.getDataAll('patients', `WHERE MATRICULE_PAT = '${req.body.patientId}'`);
                    if (patientData.length > 0) {
                        let finalData = {
                            mle: patientData[0].MATRICULE_PAT,
                            direction: patientData[0].Direction,
                            nom: patientData[0].NOM_PAT,
                            prenom: patientData[0].Prenom_PAT,
                            ...req.body.data
                        }
                        // 
                        const __PDF = require('./model/savePdf');
                        var docGenRes = await __PDF.makeDoc(finalData);
                        if (docGenRes.status)
                            reqRetData = docGenRes;
                    } else throw 'Patient not found';
                } else throw 'Consultation update failed';
            } else throw 'Preconsultation update failed';
        } else throw 'notifId invalid';
        // 
        res.end(JSON.stringify(reqRetData));
    } catch (err) {
        res.end('platformFail');
    }
});
// ADAPTED
__APP.post('/medecinChatBasicData', async (req, res) => {
    try {
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
__APP.post('/roomActiveCheck', async (req, res) => {
    try {
        let status = false;
        let notifId = await _DB.getNotifIdByRoomId(req.body.room, req.body.matricule);
        console.log(`roomActiveCheck() | notifId => `, notifId);
        if (notifId != null)
            status = true;
        // 
        res.end(status.toString());
    } catch (err) {
        res.end('platformFail');
    }
});
// 
__APP.post('/patientChatBasicData', async (req, res) => {
    try {
        let retData = [];
        if (req.body.matricule != null) {
            let data = await _DB.getDataAll('patients', `WHERE MATRICULE_PAT = '${req.body.matricule}'`);
            if (data.length > 0) {
                console.log('/patientChatBasicData | data = ', data);
                retData = [{
                    mle: data[0].MATRICULE_PAT,
                    nom: data[0].NOM_PAT,
                    prenom: data[0].Prenom_PAT,
                    direction: data[0].Direction
                }];
            } else {
                console.log('/patientChatBasicData | data = no data ?!');
            }
        } else {
            console.log('/patientChatBasicData | matricule = null');
            throw 'Matricule invalid';
        }
        res.end(JSON.stringify(retData));
    } catch (err) {
        console.log(err);
        res.end('platformFail');
    }
});
// 
__APP.post('/getNotifsByPatient', async (req, res) => {
    try {
        console.log('******');
        let retData = [];
        if (req.body.matricule != null) {
            let reqData = await _DB.getPatientNotificationsByMatricule(req.body.matricule);
            if (reqData != null)
                retData = reqData;
        }
        res.end(JSON.stringify(retData));
    } catch (err) {
        res.end('platformFail');
    }

});
// 
__APP.post('/patientFormBasicData', async (req, res) => {
    try {
        let retData = [];
        if (req.body.matricule != null) {
            let data = await _DB.getDataAll('patients', `WHERE MATRICULE_PAT = '${req.body.matricule}'`);
            if (data.length > 0) {
                console.log('/patientFormBasicData | data = ', data);
                retData = [{
                    mle: data[0].MATRICULE_PAT,
                    nom: data[0].NOM_PAT,
                    prenom: data[0].Prenom_PAT,
                    dateN: data[0].Date_Naissence
                }];
            } else {
                console.log('/patientFormBasicData | data = no data ?!');
            }
        } else {
            console.log('/patientFormBasicData | matricule = null');
            throw 'Matricule invalid';
        }
        res.end(JSON.stringify(retData));
    } catch (err) {
        console.log(err);
        res.end('platformFail');
    }
});
// 
__APP.post('/userAuth', async (req, res) => {
    let retData = 'null';
    try {
        if (req.body.matricule != null || req.body.matricule != undefined) {
            let userType = await _DB.getTypeById(req.body.matricule);
            if (userType != 'null') {
                // TEST PASSWORD HERE
                let passwordCheck = true;
                if (passwordCheck) {
                    var privateKEY = __FS.readFileSync('./private.key', 'utf8'); // to sign JWT
                    let token = __JWT.sign({
                        id: req.body.matricule
                    }, privateKEY, {
                        issuer: "3li",
                        subject: "Auth tokens",
                        audience: 'users',
                        expiresIn: "468h",
                        algorithm: "RS256"
                    });
                    let pathRedirect = userType == 'Patient' ? '/patient/form' : '/medecin/notifications';
                    retData = `${pathRedirect}?auth=${token}`;
                    // __JWT.sign(req.body.matricule, process.env.TOKEN_SECRET_KEY, (err, token) => {
                    //     if (err)
                    //         throw 'Error while signing token';
                    //     let pathRedirect = userType == 'Patient' ? '/patient/form' : '/medecin/notifications';
                    //     retData = `${pathRedirect}?auth=${token}`;
                    //     // res.redirect(`${pathRedirect}?auth=${token}`);
                    // });
                } else {
                    console.log('/userAuth | password => doesnt match the user');
                    retData = 105;
                }
            } else {
                console.log('/userAuth | userType => userNotfound in DB');
                retData = 104;
                // throw 'User not found in DB';
            }
        } else {
            console.log('/userAuth | matricule = null');
            throw 'Matricule invalid';
        }
        // res.end(retData.toString());
        // res.redirect('/login/?err=' + retData);
        console.log(retData);
        console.log(process.env.TOKEN_SECRET_KEY);
        if (typeof retData != "number" && retData != 'null')
            res.redirect(retData);
        else
            res.redirect('/login/?err=' + retData);
        // 104 => matricule n'existe pas / matricule est incorrect
        // 105 => mot de pass est incorrect
    } catch (err) {
        console.log(err);
        retData = 100;
        // res.end('platformFail');
        res.redirect('/login/?err=' + retData);
    }
});
// 
//START SERVER
__SERVER.listen(__PORT, '0.0.0.0', () => {
    console.log(`Server started...\nListening on port ${__PORT}\nhttps://localhost:${__PORT}`);
});