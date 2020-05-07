const __GLOBAL_SOCKET = io();
const __HUB_SOCKET = io('/medecinHub');
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('Socket Connected ! userId => ', sessionStorage.getItem('matricule'));
    __GLOBAL_SOCKET.emit('newUser', sessionStorage.getItem('matricule'));
});