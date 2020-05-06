const __SOCKET = io('/chat');
const __HUB_SOCKET = io('/medecinHub');
// 
//
__SOCKET.on('connect', () => {
    __SOCKET.emit('setMedecin', 'HG97');
});
// 
$.post('/getNotifications', {}, (response) => {
    if (response != null)
        response = JSON.parse(response);
});
// 
document.getElementById('btn-send').addEventListener('click', () => {
    __SOCKET.emit('msgSent', document.getElementById('txt-field').value);
});
//  
document.getElementById('btn-join').addEventListener('click', () => {
    // __SOCKET.emit('showSocketId');
    __SOCKET.emit('joinRoom', document.getElementById('roomId').value);
    // // 
    // if (peer != null) {
    //     peer.destroy();
    //     document.getElementById('clientVideo').srcObject = null;
    //     document.getElementById('remoteVideo').srcObject = null;
    // }
});
// 
__SOCKET.on('p_liste', data => {
    // console.log('cc');
    console.log(data);
});
// 
__SOCKET.on('msgReceived', msg => {
    console.log(msg);
    document.getElementById('remote').innerText += msg.content + '\n';
});
// 
__HUB_SOCKET.on('getNotifs', data => {
    console.log(data);
    // 
    // 
    __HUB_SOCKET.emit('requestValidated', )
});
// 
// 
// 
// 
let ready = false;
let peer = null;

// 
document.getElementById('btn-video').addEventListener('click', async () => {
    ready = false;
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });
    // 
    document.getElementById('clientVideo').srcObject = stream;
    // 
    peer = new SimplePeer({
        initiator: true,
        stream: stream,
        trickle: false
    });
    // 
    peer.on('stream', function (stream) {
        document.getElementById('remoteVideo').srcObject = stream;
    });
    // 
    peer.on('signal', function (data) {
        if (!ready)
            __SOCKET.emit('liveStreamLink', data);
    });

    // __SOCKET.emit('liveStreamInit');
});
// 
__SOCKET.on('liveStreamDataFlux', answer => {
    ready = true;
    peer.signal(answer);
});
// 
__SOCKET.on('patientLinkFailed', () => {
    // peer.destroy();
    document.getElementById('clientVideo').srcObject = null;
    console.log(peer);
});
// 
__SOCKET.on('hungerGmaesRbk', () => {
    // 

});