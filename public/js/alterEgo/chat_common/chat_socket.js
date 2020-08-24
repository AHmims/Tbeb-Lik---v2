const __CHAT_SOCKET = io();
// 
__CHAT_SOCKET.on('newMsg', msgData => {
    newMessage(msgData, true);
});
// 
const sendMessage = msgData => {
    __CHAT_SOCKET.emit('newMsg', msgData);
}