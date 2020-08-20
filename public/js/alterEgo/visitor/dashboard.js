const __GLOBAL_SOCKET = io();
__GLOBAL_SOCKET.on('connect', () => {
    console.log('socket on');
});