const __GLOBAL_SOCKET = io();
const _INDEX = document.getElementById('rootElement').getAttribute('data-email');
document.getElementById('rootElement').removeAttribute('data-email');
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('socket on');
    __GLOBAL_SOCKET.emit('online', _INDEX);
});
// 
__GLOBAL_SOCKET.on('newNotif', async (notifData) => {
    console.log(notifData);
    const btnRes = await renderNotification(document.getElementById('clientInbox'), notifData);
    console.log(btnRes);
});
// 
__GLOBAL_SOCKET.on('error', (msg) => {
    console.error(msg);
});
__GLOBAL_SOCKET.on('success', (msg) => {
    console.log(msg);
});