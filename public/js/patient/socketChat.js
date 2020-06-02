const __GLOBAL_SOCKET = io();
let __PEER;
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
let stream = null;
__GLOBAL_SOCKET.on('liveStreamDataFlux', async (offer) => {
    // let status = ;
    // if (confirm('Votre medecin est entrain de vous appelle.')) {
    let btnRes = await toastConfirm(`Votre medecin est entrain de vous appelle.`);
    if (btnRes) {
        videoChatIconsControlls();
        showVideoBox();
        // 
        stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        // 
        document.getElementById('clientVideo').srcObject = stream;
        // 
        __PEER = new SimplePeer({
            initiator: false,
            stream: stream,
            iceTransportPolicy: 'relay',
            trickle: false,
            config: {
                iceServers: [{
                    urls: ["stun:eu-turn1.xirsys.com"]
                }, {
                    username: "ihySyqDUKfNLk7-RgdPz97TucUIdJxVOJtuKg8BhhisaLp9KRMz08AQ8jRhjbXfLAAAAAF7Vm31uaW9jZQ==",
                    credential: "fa34f73c-a466-11ea-a913-0242ac140004",
                    urls: ["turn:eu-turn1.xirsys.com:80?transport=udp", "turn:eu-turn1.xirsys.com:3478?transport=udp", "turn:eu-turn1.xirsys.com:80?transport=tcp", "turn:eu-turn1.xirsys.com:3478?transport=tcp", "turns:eu-turn1.xirsys.com:443?transport=tcp", "turns:eu-turn1.xirsys.com:5349?transport=tcp"]
                }]
            }
        })
        // 
        // 
        __PEER.on('stream', function (stream) {
            console.log('liveStreamDataFlux() / stream() | stream => ', stream);
            document.getElementById('remoteVideo').srcObject = stream;
            // 
            controllPosters("none");
            // document.getElementById('remoteVideoPoster').style.display = "none";
            // document.getElementById('hostVideoPoster').style.display = "none";
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
        stream.getTracks().forEach(function (track) {
            track.stop();
        });
        // 
        controllPosters("flex");
        // 
        hideVideoBox();

        // document.getElementById('remoteVideoPoster').style.display = "flex";
        // document.getElementById('hostVideoPoster').style.display = "flex";
    }
});

// 
// 
function sendMsg(content) {
    __GLOBAL_SOCKET.emit('sendMsg', content, new Date().toJSON().slice(0, 19).replace('T', ' '), 'text');
}
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
        // 
        hideVideoBox();

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
// 
function showVideoBox() {
    document.getElementById('videoSection').style.display = "flex";
    document.getElementById('chatSection').style.height = "500px !important";
    showVideoSection();
}

function hideVideoBox() {
    document.getElementById('videoSection').style.display = "none";
    document.getElementById('chatSection').style.height = "90 vh";
    hideVideoSection();
}