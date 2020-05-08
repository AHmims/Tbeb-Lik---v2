const globSocket = io();
const __SOCKET = io('/chat');
let __PEER = null;
// 
__SOCKET.on('connect', () => {
    __SOCKET.emit('setPatient', sessionStorage.getItem('user_M'));
});
__SOCKET.on('msgReceived', msg => {
    displayReceivedMsg(msg);
});
// 
// 
__SOCKET.on('liveStreamDataFlux', async (offer) => {
    // let status = ;
    if (confirm('Votre medecin est entrain de vous appelle.')) {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        // 
        document.getElementById('clientVideo').srcObject = stream;
        // 
        __PEER = new SimplePeer({
            initiator: false,
            stream: stream,
            trickle: false
        })
        // 
        // 
        __PEER.on('stream', function (stream) {
            document.getElementById('remoteVideo').srcObject = stream;
            document.getElementById('remoteVideoPoster').style.display = "none";
            console.log('Stream()');
        });
        // 
        __PEER.on('signal', function (data) {
            console.log('signal()');
            __SOCKET.emit('liveStreamLink', data);
        });
        // 
        __PEER.signal(offer);
    } else {
        __SOCKET.emit('liveStreamInitFail');
    }
});
// 
__SOCKET.on('liveStreamTerminated', () => {
    if (__PEER != null) {
        __PEER = null;
        document.getElementById('clientVideo').srcObject = null;
        document.getElementById('remoteVideo').srcObject = null;
        // 
        document.getElementById('remoteVideoPoster').style.display = "flex";
    }
});
// 
// 
__SOCKET.on('newNotification', (date, state, nId) => {
    addNotification(date, state, nId);
});
// 
// 
// 
function sendNotification(data) {
    globSocket.emit('newNotif', data);
}

function sendMsg(msg) {
    __SOCKET.emit('msgSent', msg);
}
// 
// 