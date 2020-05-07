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
    });
    socket.on('sendNotif', async data => {

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
    let result = await _DB.getTypeById(req.body.matricule);
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
// __APP.post('/')
// 
// 
//START SERVER
__SERVER.listen(__PORT, '0.0.0.0', () => {
    console.log(`Server started...\nListening on port ${__PORT}\nhttps://localhost:${__PORT}`);
});