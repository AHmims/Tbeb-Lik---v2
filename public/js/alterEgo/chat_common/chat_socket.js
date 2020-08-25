const __CHAT_SOCKET = io();
// 
__CHAT_SOCKET.on('newMsg', msgData => {
    newMessage(msgData, true);
});
// 
const sendMessage = msgData => {
    const urlArray = window.location.href.split('/');
    __CHAT_SOCKET.emit('newMsg', msgData, urlArray[urlArray.length - 1].split('?')[0]);
}