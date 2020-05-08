const __GLOBAL_SOCKET = io();
const __CHAT = io('/chat');
// 
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('Socket Connected ! userId => ', sessionStorage.getItem('matricule') || null);
    __GLOBAL_SOCKET.emit('newUser', sessionStorage.getItem('matricule'));
    joinRoom();
});
// 
__CHAT.on('receiveMsg', msg => {
    displayReceivedMsg(msg);
});
// 
// 
function joinRoom() {
    const _URL_PARAMS = new URLSearchParams(window.location.search);
    __CHAT.emit('joinChat', sessionStorage.getItem('matricule'), _URL_PARAMS.get('room'), _URL_PARAMS.get('patient'));
}
// 
function sendMsg(content) {
    __CHAT.emit('sendMsg', content);
}