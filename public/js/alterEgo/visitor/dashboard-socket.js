const __GLOBAL_SOCKET = io();
const _INDEX = document.getElementById('rootElement').getAttribute('data-email');
document.getElementById('rootElement').removeAttribute('data-email');
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('socket on');
    __GLOBAL_SOCKET.emit('online', _INDEX);
});
__GLOBAL_SOCKET.on('acceptNotif', (notifId, notifData) => {
    remove_onHold();
    display_consultation(notifData);
});
__GLOBAL_SOCKET.on('refuseNotif', (notifId, notifData) => {
    remove_onHold();
    display_past_consultation(notifData);
});
// 
const socket_sendPreCons = preCons_object => {
    try {
        __GLOBAL_SOCKET.emit('sendNotif', preCons_object);
    } catch (err) {
        console.error(err);
    }
}
const socket_cancelPrecons = (notifId, visitorId) => {
    __GLOBAL_SOCKET.emit('cancelNotif', notifId, visitorId);
}
// 
// 
__GLOBAL_SOCKET.on('error', (msg) => {
    console.error(msg);
});
__GLOBAL_SOCKET.on('success', (msg) => {
    console.log(msg);
});