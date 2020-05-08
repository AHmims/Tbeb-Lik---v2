const __GLOBAL_SOCKET = io();
const __CHAT = io('/chat');
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('Socket Connected ! userId => ', sessionStorage.getItem('matricule') || null);
    __GLOBAL_SOCKET.emit('newUser', sessionStorage.getItem('matricule'));
    joinRoom();
});
// 
// 
function joinRoom() {
    let urlParams = new URLSearchParams(window.location.search);
    __CHAT.emit('joinChat', sessionStorage.getItem('matricule'), urlParams.get('room'), urlParams.get('patient'));
}