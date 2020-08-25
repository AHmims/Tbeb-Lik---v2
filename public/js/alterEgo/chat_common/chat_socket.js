__GLOBAL_SOCKET.on('newMsg', msgData => {
    chat_newMessage(msgData, true);
});
// 
const sendMessage = msgData => {
    const urlArray = window.location.href.split('/');
    __GLOBAL_SOCKET.emit('newMsg', msgData, urlArray[urlArray.length - 1].split('?')[0]);
}
// 
// 