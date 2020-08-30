const __GLOBAL_SOCKET = io();
const _INDEX = document.getElementById('rootElement').getAttribute('data-email');
document.getElementById('rootElement').removeAttribute('data-email');
// 
__GLOBAL_SOCKET.on('connect', () => {
    // console.log('socket on');
    // logToast(`Connecté avec succès`);
    __GLOBAL_SOCKET.emit('online', _INDEX);
});
__GLOBAL_SOCKET.on('acceptNotif', (notifId, notifData) => {
    remove_onHold();
    hide_state_container();
    display_consultation(notifData);
});
__GLOBAL_SOCKET.on('refuseNotif', (notifId, notifData) => {
    remove_onHold();
    display_preconsForm();
    display_past_consultation(notifData);
});
// 
const socket_sendPreCons = preCons_object => {
    __GLOBAL_SOCKET.emit('sendNotif', preCons_object);
}
const socket_cancelPrecons = (notifId, visitorId) => {
    __GLOBAL_SOCKET.emit('cancelNotif', notifId, visitorId);
}
// 
// 
__GLOBAL_SOCKET.on('error', async (msg = '') => {
    // console.error(msg);
    if (msg != '')
        await logError(msg);
    else
        await logServerError();

});
__GLOBAL_SOCKET.on('success', async (msg = '') => {
    // console.log(msg);
    // if (msg != '')
    // await logSuccess(msg);
    // else
    //     await logServerError();
});