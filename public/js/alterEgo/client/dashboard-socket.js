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
    renderNotification(document.getElementById('clientInbox'), notifData, (notifId, visitorId) => {
        console.log('Success');
        _SOCKET_ACCEPT_NOTIFICATION(notifId, visitorId);
    }, (notifId, visitorId, notifData) => {
        console.log('Refuse');
        _SOCKET_REFUSE_NOTIFICATION(notifId, visitorId, notifData);
        // __GLOBAL_SOCKET.emit('error');
    });
});
__GLOBAL_SOCKET.on('cancelNotif', notifId => {
    remove_precons(notifId);
});
// 
// 
const _SOCKET_ACCEPT_NOTIFICATION = (notifId, visitorId) => {
    __GLOBAL_SOCKET.emit('acceptNotif', notifId, visitorId);
}
const _SOCKET_REFUSE_NOTIFICATION = (notifId, visitorId, notifData) => {
    __GLOBAL_SOCKET.emit('refuseNotif', notifId, visitorId, notifData);
}
// 
// 
__GLOBAL_SOCKET.on('error', (msg = 'no message provided') => {
    console.error(msg);
});
__GLOBAL_SOCKET.on('success', (msg = 'no message provided') => {
    console.log(msg);
});