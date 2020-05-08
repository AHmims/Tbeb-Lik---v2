const __GLOBAL_SOCKET = io();
let __PEER;
// 
// 
__GLOBAL_SOCKET.on('connect', async () => {
    console.log('Socket Connected ! userId => ', sessionStorage.getItem('matricule') || null);
    await __GLOBAL_SOCKET.emit('newUser', sessionStorage.getItem('matricule'));
    joinRoom();
});
// 
__GLOBAL_SOCKET.on('receiveMsg', msg => {
    displayReceivedMsg(msg);
});
// 
// 
async function joinRoom() {
    const _URL_PARAMS = new URLSearchParams(window.location.search);
    await __GLOBAL_SOCKET.emit('joinChat', sessionStorage.getItem('matricule'), _URL_PARAMS.get('room'), _URL_PARAMS.get('patient'));
}
// 
async function sendMsg(content) {
    await __GLOBAL_SOCKET.emit('sendMsg', content);
}
// 
let ready = false;
async function streaminit() {
    ready = false;
    // 
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });
    // 
    document.getElementById('clientVideo').srcObject = stream;
    console.log('streaminit() | stream => ', stream);
    // 
    __PEER = new SimplePeer({
        initiator: true,
        stream: stream,
        trickle: false
    });
    console.log('streaminit() | peer => ', __PEER);
    // 
    __PEER.on('signal', async function (data) {
        if (!ready) {
            await __GLOBAL_SOCKET.emit('liveStreamLink', data);
            console.log('streaminit() / signal() | ready | data => ', data);
        } else console.log('streaminit() / signal() | notReady | data => ', data);
    });
    // 
    __PEER.on('stream', function (stream) {
        // console.log('stream()');
        console.log('streaminit() / stream() | stream => ', stream);
        document.getElementById('remoteVideo').srcObject = stream;
        // document.getElementById('remoteVideoPoster').style.display = "none";
    });
    // 
}
__GLOBAL_SOCKET.on('liveStreamDataFlux', answer => {
    ready = true;
    __PEER.signal(answer);
});
// 
__GLOBAL_SOCKET.on('patientLinkFailed', () => {
    __PEER.destroy();
    document.getElementById('clientVideo').srcObject = null;
});

// 
function endCall() {
    if (__PEER != null) {
        __PEER = null;
        document.getElementById('clientVideo').srcObject = null;
        document.getElementById('remoteVideo').srcObject = null;
        // 
        // document.getElementById('remoteVideoPoster').style.display = "flex";
    }
    __GLOBAL_SOCKET.emit('endCall');
}