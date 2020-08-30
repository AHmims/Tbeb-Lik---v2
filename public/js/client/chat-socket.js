const __GLOBAL_SOCKET = io();
const _INDEX = document.getElementById('rootElement').getAttribute('data-email');
document.getElementById('rootElement').removeAttribute('data-email');
// 
__GLOBAL_SOCKET.on('connect', () => {
    // console.log('socket on');
    __GLOBAL_SOCKET.emit('online', _INDEX);
    // 
    const urlArray = window.location.href.split('/');
    __GLOBAL_SOCKET.emit('joinChat', _INDEX, urlArray[urlArray.length - 1].split('?')[0])
});
// 
// 
__GLOBAL_SOCKET.on('error', async (msg = '') => {
    // console.error(msg);
    if (msg != '')
        await logError(msg);
    else
        await logServerError();

});
__GLOBAL_SOCKET.on('success', async (msg = '') => {
    // console.log(msg);
    // if (msg != '')
    // await logSuccess(msg);
    // else
    //     await logServerError();
}); // 
// 
// VIDEO CHAT
let __PEER;
let ready = false;
let stream = null;
async function streaminit() {
    try {
        ready = false;
        // 
        stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        // 
        document.getElementById('hostVideo').srcObject = stream;
        // console.log('streaminit() | stream => ', stream);
        // 
        __PEER = new SimplePeer({
            initiator: true,
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
        });
        // console.log('streaminit() | peer => ', __PEER);
        // 
        __PEER.on('signal', async data => {
            if (!ready) {
                __GLOBAL_SOCKET.emit('liveStreamLink', data);
                // console.log('streaminit() / signal() | ready | data => ', data);
            } //else console.log('streaminit() / signal() | notReady | data => ', data);
        });
        // 
        __PEER.on('error', (err) => {
            clear_videoChat();
        });
        // 
        __PEER.on('stream', stream => {
            // console.log('stream()');
            // console.log('streaminit() / stream() | stream => ', stream);
            video_container_posters_controller_HIDE();
            document.getElementById('remoteVideo').srcObject = stream;
            // 
            // video_container_posters_controller();
            // controllPosters("none");
            // document.getElementById('remoteVideoPoster').style.display = "none";
        });
        // 
    } catch (err) {
        console.error(err);
        clear_videoChat();
    }
}

function endCall() {
    if (__PEER != null) {
        __PEER = null;
        document.getElementById('hostVideo').srcObject = null;
        document.getElementById('remoteVideo').srcObject = null;
        // 
        stream.getTracks().forEach(function (track) {
            track.stop();
        });
        // 
        __GLOBAL_SOCKET.emit('endCall');
        // 
        // video_container_posters_controller();
        video_container_posters_controller_SHOW();
        video_container_display_controller();
        // 
        logToast(`L'appel vidéo est terminé`);
        // controllPosters("flex");
        // document.getElementById('remoteVideoPoster').style.display = "flex";
    }
}
// 
function micControll() {
    // switchIconMic(stream.getAudioTracks()[0].enabled);
    stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
}

function camControll() {
    // switchIconCam(stream.getVideoTracks()[0].enabled);
    stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
}
// 
// 
__GLOBAL_SOCKET.on('liveStreamDataFlux', answer => {
    ready = true;
    // console.log(answer);
    __PEER.signal(answer);
});
// 
__GLOBAL_SOCKET.on('patientLinkFailed', () => {
    __PEER.destroy();
    document.getElementById('hostVideo').srcObject = null;
    // 
    // video_container_posters_controller();
    clear_videoChat();
    // controllPosters("flex");
});
// 
__GLOBAL_SOCKET.on('liveStreamTerminated', () => {
    clear_videoChat();
});
// 
function clear_videoChat() {
    if (__PEER != null) {
        __PEER = null;
        document.getElementById('hostVideo').srcObject = null;
        document.getElementById('remoteVideo').srcObject = null;
        // 
        stream.getTracks().forEach(function (track) {
            track.stop();
        });
        // 
        // video_container_posters_controller();
        video_container_posters_controller_SHOW();
        video_container_display_controller();
        // controllPosters("flex");
        // 
        // document.getElementById('videoSection').style.display = "none";
        // document.getElementById('remoteVideoPoster').style.display = "flex";
    }
}

// 