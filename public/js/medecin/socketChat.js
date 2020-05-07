const __GLOBAL_SOCKET = io();
const __CHAT = io('/chat');
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('Socket Connected ! userId => ', sessionStorage.getItem('matricule') || null);
    __GLOBAL_SOCKET.emit('newUser', sessionStorage.getItem('matricule'));
});