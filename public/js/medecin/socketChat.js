const __GLOBAL_SOCKET = io();
let __PEER;
// 
// 
__GLOBAL_SOCKET.on('connect', async () => {
    console.log('Socket Connected ! userId => ', localStorage.getItem('authToken') || null);
    await __GLOBAL_SOCKET.emit('newUser', localStorage.getItem('authToken'));
});
// 
__GLOBAL_SOCKET.on('receiveMsg', msg => {
    displayReceivedMsg(msg);
});
__GLOBAL_SOCKET.on('platformFail', async () => {
    // console.log('some error in code | refresh page');
    await logServerError();
});
// 
// 
// 
async function joinRoom() {
    const _URL_PARAMS = new URLSearchParams(window.location.search);
    await __GLOBAL_SOCKET.emit('joinChat', localStorage.getItem('authToken'), _URL_PARAMS.get('room'), _URL_PARAMS.get('patient'));
}
// 
async function sendMsg(content, type, file) {
    await __GLOBAL_SOCKET.emit('sendMsg', content, new Date().toJSON().slice(0, 19).replace('T', ' '), type, file);
}
// 
let ready = false;
let stream = null;
async function streaminit() {
    ready = false;
    // 
    stream = await navigator.mediaDevices.getUserMedia({
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
        // 
        controllPosters("none");
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
    // 
    controllPosters("flex");
});
// 
__GLOBAL_SOCKET.on('liveStreamTerminated', () => {
    if (__PEER != null) {
        __PEER = null;
        document.getElementById('clientVideo').srcObject = null;
        document.getElementById('remoteVideo').srcObject = null;
        // 
        stream.getTracks().forEach(function (track) {
            track.stop();
        });
        // 
        controllPosters("flex");
        // 
        document.getElementById('videoSection').style.display = "none";
        // document.getElementById('remoteVideoPoster').style.display = "flex";
    }
});


// 
function endCall() {
    if (__PEER != null) {
        __PEER = null;
        document.getElementById('clientVideo').srcObject = null;
        document.getElementById('remoteVideo').srcObject = null;
        // 
        stream.getTracks().forEach(function (track) {
            track.stop();
        });
        // 
        __GLOBAL_SOCKET.emit('endCall');
        // 
        controllPosters("flex");
        // document.getElementById('remoteVideoPoster').style.display = "flex";
    }
}
// 
function micControll() {
    switchIconMic(stream.getAudioTracks()[0].enabled);
    stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
}

function camControll() {
    switchIconCam(stream.getVideoTracks()[0].enabled);
    stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
}
// 