const _CLASSES = require('../model/classes');
const _DB = require('../model/dbQuery');

module.exports = (socket) => {
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
}