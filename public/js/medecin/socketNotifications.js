const __GLOBAL_SOCKET = io();
const __HUB_SOCKET = io('/medecinHub');
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('Socket Connected ! userId => ', localStorage.getItem('matricule') || null);
    __GLOBAL_SOCKET.emit('newUser', localStorage.getItem('matricule'));
});
__GLOBAL_SOCKET.on('activeNotification', (data) => {
    generateActiveNotification(data);
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
function acceptNotification(nId) {
    __GLOBAL_SOCKET.emit('acceptNotif', nId);
    __HUB_SOCKET.emit('acceptNotif', nId);
}