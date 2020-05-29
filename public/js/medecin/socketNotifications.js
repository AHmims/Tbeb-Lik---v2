const __GLOBAL_SOCKET = io();
const __HUB_SOCKET = io('/medecinHub');
// 
__GLOBAL_SOCKET.on('connect', () => {
    // console.log('Socket Connected ! userId => ', localStorage.getItem('matricule') || null);
    __GLOBAL_SOCKET.emit('newUser', localStorage.getItem('matricule'));
});
__GLOBAL_SOCKET.on('activeNotification', (data) => {
    generateActiveNotification(data);
});
__GLOBAL_SOCKET.on('notifAlreadyAccepted', async () => {
    // 
    // 
    await logError('Demande de consultation déja accepté par un autre medecin');
    window.location.reload();
});
// 
__GLOBAL_SOCKET.on('platformFail', async () => {
    // console.log('some error in code | refresh page');
    await logServerError();
});
// 
// 
__HUB_SOCKET.on('receivedNotification', data => {
    console.log('receivedNotification : notifData => ', data);
    generateNotification([data]);
});
__HUB_SOCKET.on('removeNotificationBox', nId => {
    console.log('removeNotificationBox : notifId => ', nId);
    removeNotification(nId);
});
__HUB_SOCKET.on('tist', () => {
    console.log("c'est maaaagic");
});
// 
// 
// FUNCTIONS CALLED FROM >VIEW 
function acceptNotification(nId, date) {
    // TO ADAPT
    // var date = new Date().toJSON().slice(0, 19).replace('T', ' '); //DATE SELECTED BY MEDECIN
    // 
    __GLOBAL_SOCKET.emit('acceptNotif', nId, date);
    __HUB_SOCKET.emit('acceptNotif', nId);
}