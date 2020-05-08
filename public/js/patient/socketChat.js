const __GLOBAL_SOCKET = io();
// const __CHAT = io('/chat');
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('Socket Connected ! userId => ', sessionStorage.getItem('matricule') || null);
    __GLOBAL_SOCKET.emit('newUser', sessionStorage.getItem('matricule'));
});
// __CHAT.on('connect', () => {
//     __CHAT.emit('patientJoinRoom', sessionStorage.getItem('matricule'));
// });
// 
__GLOBAL_SOCKET.on('receiveMsg', msg => {
    displayReceivedMsg(msg);
});
// 
// 
function sendMsg(content) {
    __GLOBAL_SOCKET.emit('sendMsg', content);
}