const __GLOBAL_SOCKET = io();
const _INDEX = document.getElementById('rootElement').getAttribute('data-email');
document.getElementById('rootElement').removeAttribute('data-email');
// 
__GLOBAL_SOCKET.on('connect', () => {
    // console.log('socket on');
    __GLOBAL_SOCKET.emit('online', _INDEX);
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
let stream = null;
__GLOBAL_SOCKET.on('liveStreamDataFlux', async offer => {
    // console.log(offer);
    // let status = ;
    // if (confirm('Votre medecin est entrain de vous appelle.')) {
    let btnRes = await toastConfirm(`Votre medecin est entrain de vous appellez.`);
    if (btnRes) {
        // videoChatIconsControlls();
        try {
            // video_container_posters_controller();
            video_container_posters_controller_SHOW();
            video_container_display_controller();
            // showVideoBox();
            // 
            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            // 
            document.getElementById('hostVideo').srcObject = stream;
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
            });
            // 
            // 
            __PEER.on('stream', stream => {
                // console.log('liveStreamDataFlux() / stream() | stream => ', stream);
                video_container_posters_controller_HIDE();
                document.getElementById('remoteVideo').srcObject = stream;
                // 
                // controllPosters("none");
                // document.getElementById('remoteVideoPoster').style.display = "none";
                // document.getElementById('hostVideoPoster').style.display = "none";
                // document.getElementById('remoteVideoPoster').style.display = "none";
                // console.log('Stream()');
                // video_container_posters_controller();
            });
            // 
            __PEER.on('signal', data => {
                // console.log('signal()');
                // console.log('liveStreamDataFlux() / signal() | ready | data => ', data);
                __GLOBAL_SOCKET.emit('liveStreamLink', data);
            });
            // 
            __PEER.on('error', (err) => {
                clear_videoChat();
                // console.error(err);
                // logServerError();
                logError(err);
            });
            // 
            // console.log('liveStreamDataFlux() | offre => ', offer);
            __PEER.signal(offer);
            // } else {
            //     __GLOBAL_SOCKET.emit('liveStreamInitFail');
            // }
        } catch (err) {
            console.error(err);
            clear_videoChat();
        }
    } else {
        __GLOBAL_SOCKET.emit('liveStreamInitFail');
        await logToast(`Vous avez refusé la demande d'appele vidéo.`);
    }
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
        stream.getTracks().forEach(track => {
            track.stop();
        });
        // 
        // controllPosters("flex");
        // 
        // hideVideoBox();
        // video_container_posters_controller();
        video_container_posters_controller_SHOW();
        video_container_display_controller();
        // 
        logToast(`L'appel vidéo est terminé`);
        // document.getElementById('remoteVideoPoster').style.display = "flex";
        // document.getElementById('hostVideoPoster').style.display = "flex";
    }
}
// 
// 
function endCall() {
    if (__PEER != null) {
        __PEER = null;
        document.getElementById('hostVideo').srcObject = null;
        document.getElementById('remoteVideo').srcObject = null;
        // 
        stream.getTracks().forEach(track => {
            track.stop();
        });
        // 
        __GLOBAL_SOCKET.emit('endCall');
        // 
        // controllPosters("flex");
        // 
        // hideVideoBox();
        // document.getElementById('remoteVideoPoster').style.display = "flex";
        // video_container_posters_controller();
        video_container_posters_controller_SHOW();
        video_container_display_controller();
        // 
        logToast(`L'appel vidéo est terminé`);
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