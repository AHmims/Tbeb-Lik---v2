const _CLASSES = require('../model/classes');
const _DB = require('../model/dbQuery');
const {
    clientDataFromVisitor,
    unlinkClientFromRooms
} = require('../helper/helpers');

module.exports = socket => {
    // WHEN A USER CONNECTS
    socket.on('online', async userEmail => {
        try {
            const userData = await _DB.getUserAuthData('email', userEmail);
            if (userData != null) {
                const userId = userData.userId;
                // 
                const updateRes = await _DB.customDataUpdate({
                    online: 1, // WHAT TO UPDATE
                    socket: socket.id
                }, userId, { // SELECTOR VALUE
                    table: "appUser", // SELECTOR TABLE
                    id: "userId" // SELECTOR KEY
                });
                if (updateRes) {
                    if (userData.userType == 'Visitor') {
                        const appUserData = await _DB.getAllData('appUser', `WHERE userId = '${userId}'`);
                        if (appUserData != null) {
                            socket.join(appUserData.roomId);
                        } else throw 'Error while initializing';
                    }
                    socket.userId = userId;
                    socket.userType = userData.userType;
                    socket.emit('success', 'Initialized successfully');
                } else throw 'Error while initializing, please refreash the page and try again.';
            } else throw 'Email is not valid';
        } catch (err) {
            console.error(err);
            socket.emit('error', err);
        }
    });
    // WHEN VISITOR SEND NOTIF TO CLIENT
    socket.on('sendNotif', async notifData => {
        try {
            // console.log(notifData);
            const clientData = await _DB.getAllData('appUser', `WHERE userId = '${notifData.clientId}'`);
            if (clientData != null) {
                socket.to(clientData[0].socket).emit('newNotif', notifData);
            } else throw `Client not found`;
        } catch (err) {
            console.error(err);
            socket.emit('error', err);
        }
    });
    // WHEN VISITOR CANCEL NOTIF
    socket.on('cancelNotif', async (notifId, visitorId) => {
        let clientData = await clientDataFromVisitor(visitorId);
        if (clientData != null) {
            clientData = clientData[0];
            socket.to(clientData.socket).emit('cancelNotif', notifId);
        } else socket.emit('error', `Client not found`);
    });
    // WHEN A CLIENT ACCEPTS THE NOTIFICATION
    socket.on('acceptNotif', async (notifId, visitorId, notifData) => {
        let visitorData = await _DB.getAllData(`appUser`, `WHERE userId = '${visitorId}'`);
        if (visitorData != null) {
            visitorData = visitorData[0];
            socket.to(visitorData.socket).emit('acceptNotif', notifId, notifData);
        } else socket.emit('error', `Visitor not found`);
    });
    // WHEN A CLIENT REFUSES THE NOTIFICATION
    socket.on('refuseNotif', async (notifId, visitorId, notifData) => {
        let visitorData = await _DB.getAllData(`appUser`, `WHERE userId = '${visitorId}'`);
        if (visitorData != null) {
            visitorData = visitorData[0];
            socket.to(visitorData.socket).emit('refuseNotif', notifId, notifData);
        } else socket.emit('error', `Visitor not found`);
    });
    // CLIENT JOINS CHAT
    socket.on('joinChat', async (userEmail, notifId) => {
        // const clientData =
        try {
            // const clientData = await _DB.getUserAuthData('email', userEmail);
            // if (clientData != null) {
            const unlinkRes = await unlinkClientFromRooms(socket.userId);
            // 
            let roomData = await _DB.getAllData('room', `WHERE roomVisitorId IN (SELECT visitorId FROM preConsultation WHERE preConsId = '${notifId}')`);
            if (roomData != null) {
                roomData = roomData[0];
                // 
                let clientLinkRes = await _DB.customDataUpdate({
                    roomClientId: socket.userId
                }, roomData.roomId, {
                    table: "room",
                    id: "roomId"
                });
                // 
                socket.emit('success', clientLinkRes);
            } else throw `Room not found`;
            // } else throw `Client not found`;
        } catch (err) {
            console.error(err);
            socket.emit('error', err);
        }
    });
    // WHEN A USER SENDS A NEW MESSAGE
    socket.on('newMsg', async (msgData, notifId) => {
        try {
            const reqParams = socket.userType == 'Visitor' ? ['clientId', 'consultation'] : ['visitorId', 'preConsultation'];
            const userData = await _DB.getAllData('appUser', `WHERE userId IN (SELECT ${reqParams[0]} FROM ${reqParams[1]} WHERE preConsId = '${notifId}')`);
            if (userData != null) {
                socket.to(userData[0].socket).emit('newMsg', msgData)
            } else throw `User not found`;
        } catch (err) {
            console.error(err);
            socket.emit('error', err);
        }
    });
    // WHEN A USER DISCONNECYS
    socket.on('disconnect', async () => {
        // console.log(`socket OFF | ${socket.userId}`);
        try {
            if (socket.userId != null) {
                const updateRes = await _DB.customDataUpdate({
                    online: 0 // WHAT TO UPDATE
                }, socket.userId, { // SELECTOR VALUE
                    table: "appUser", // SELECTOR TABLE
                    id: "userId" // SELECTOR KEY
                });
                if (updateRes)
                    socket.emit('success', 'Successfully disconnected');
                else throw 'Error while initializing, please refreash the page and try again.';
            } //else throw 'Email is not valid';
        } catch (err) {
            console.error(err);
            socket.emit('error', err);
        }
    });
    // 
    socket.on('error', (errMsg = null) => {
        socket.emit('error', errMsg);
    });
}