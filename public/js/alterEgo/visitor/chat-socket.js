const __GLOBAL_SOCKET = io();
const _INDEX = document.getElementById('rootElement').getAttribute('data-email');
document.getElementById('rootElement').removeAttribute('data-email');
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('socket on');
    __GLOBAL_SOCKET.emit('online', _INDEX);
});
__GLOBAL_SOCKET.on('newMsg', msgData => {
    chat_newMessage(msgData, true);
});
// 
// 
const sendMessage = msgData => {
    const urlArray = window.location.href.split('/');
    __GLOBAL_SOCKET.emit('newMsg', msgData, urlArray[urlArray.length - 1].split('?')[0]);
}
// 
// 
__GLOBAL_SOCKET.on('error', (msg = 'no message provided') => {
    console.error(msg);
});
__GLOBAL_SOCKET.on('success', (msg = 'no message provided') => {
    console.log(msg);
});