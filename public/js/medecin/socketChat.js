const __GLOBAL_SOCKET = io();
// const __CHAT = io('/chat');
// 
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('Socket Connected ! userId => ', sessionStorage.getItem('matricule') || null);
    __GLOBAL_SOCKET.emit('newUser', sessionStorage.getItem('matricule'));
    joinRoom();
});
// 
__GLOBAL_SOCKET.on('receiveMsg', msg => {
    displayReceivedMsg(msg);
});
// 
// 
function joinRoom() {
    const _URL_PARAMS = new URLSearchParams(window.location.search);
    __GLOBAL_SOCKET.emit('joinChat', sessionStorage.getItem('matricule'), _URL_PARAMS.get('room'), _URL_PARAMS.get('patient'));
}
// 
function sendMsg(content) {
    __GLOBAL_SOCKET.emit('sendMsg', content);
}