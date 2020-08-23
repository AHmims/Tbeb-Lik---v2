const __GLOBAL_SOCKET = io();
const _INDEX = document.getElementById('rootElement').getAttribute('data-email');
document.getElementById('rootElement').removeAttribute('data-email');
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('socket on');
    __GLOBAL_SOCKET.emit('online', _INDEX);
});
// 
const sendPreCons = preCons_object => {
    try {
        __GLOBAL_SOCKET.emit('sendNotif', preCons_object);
    } catch (err) {
        console.error(err);
    }
}
const cancelPrecons = notifId => {
    __GLOBAL_SOCKET.emit('cancelNotif', notifId);
}
// 
// 
__GLOBAL_SOCKET.on('error', (msg) => {
    console.error(msg);
});
__GLOBAL_SOCKET.on('success', (msg) => {
    console.log(msg);
});