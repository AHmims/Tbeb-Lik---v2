const __GLOBAL_SOCKET = io();
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('Socket Connected ! userId => ', sessionStorage.getItem('matricule') || null);
    __GLOBAL_SOCKET.emit('newUser', sessionStorage.getItem('matricule'));
});
// 
__GLOBAL_SOCKET.on('receiveMsg', msg => {
    displayReceivedMsg(msg);
});
// 
// 
__GLOBAL_SOCKET.on('liveStreamDataFlux', async (offer) => {
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
            console.log('liveStreamDataFlux() / stream() | stream => ', stream);
            document.getElementById('remoteVideo').srcObject = stream;
            // document.getElementById('remoteVideoPoster').style.display = "none";
            // console.log('Stream()');
        });
        // 
        __PEER.on('signal', function (data) {
            // console.log('signal()');
            console.log('liveStreamDataFlux() / signal() | ready | data => ', data);
            __GLOBAL_SOCKET.emit('liveStreamLink', data);
        });
        // 
        console.log('liveStreamDataFlux() | offre => ', offer);
        __PEER.signal(offer);
    } else {
        __GLOBAL_SOCKET.emit('liveStreamInitFail');
    }
});
// 
__GLOBAL_SOCKET.on('liveStreamTerminated', () => {
    if (__PEER != null) {
        __PEER = null;
        document.getElementById('clientVideo').srcObject = null;
        document.getElementById('remoteVideo').srcObject = null;
        // 
        // document.getElementById('remoteVideoPoster').style.display = "flex";
    }
});

// 
// 
function sendMsg(content) {
    __GLOBAL_SOCKET.emit('sendMsg', content);
}