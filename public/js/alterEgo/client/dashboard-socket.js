const __GLOBAL_SOCKET = io();
const _INDEX = document.getElementById('rootElement').getAttribute('data-email');
document.getElementById('rootElement').removeAttribute('data-email');
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('socket on');
    __GLOBAL_SOCKET.emit('online', _INDEX);
});
// 
__GLOBAL_SOCKET.on('newNotif', notifData => {
    console.log(notifData);
    renderNotification(document.getElementById('clientInbox'), notifData, () => {
        console.log('success')
    }, () => {
        console.log('fail');
        __GLOBAL_SOCKET.emit('error');
    });
});
// 
// 
const _SOCKET_ACCEPT_NOTIFICATION = (notifId, visitorId) => {
    __GLOBAL_SOCKET.emit('acceptNotif', notifId, visitorId);
}
// 
// 
__GLOBAL_SOCKET.on('error', (msg = 'null') => {
    console.error(msg);
});
__GLOBAL_SOCKET.on('success', (msg) => {
    console.log(msg);
});