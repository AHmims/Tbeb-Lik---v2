const __SOCKET = io('/chat');
const __HUB_SOCKET = io('/medecinHub');
let __PEER, ready = false;
//
__SOCKET.on('connect', () => {
    console.log('ff');
    __SOCKET.emit('setMedecin', sessionStorage.getItem('user_M'));
});
__SOCKET.on('msgReceived', msg => {
    console.log(msg);
    displayReceivedMsg(msg);
});
__SOCKET.on('p_liste', patients => {
    if (window.location.pathname == "/medecin/contact") {
        console.log(patients);
        displayPatientsList(patients);
    }
});
// 
// 
__SOCKET.on('liveStreamDataFlux', answer => {
    ready = true;
    __PEER.signal(answer);
});
// 
__SOCKET.on('patientLinkFailed', () => {
    __PEER.destroy();
    document.getElementById('clientVideo').srcObject = null;
});

// 
// 
__HUB_SOCKET.on('getNotifs', data => {
    if (window.location.pathname == "/medecin/notifications") {
        console.log(data);
        notifMiddleMan(data);
    }
});
// 
__HUB_SOCKET.on('notifAccepted', nId => {
    console.log(nId);
    hideSelectedNotifBox(nId);
});
// 
// 
// 
function notificationAccepted(notifId, date) {
    __SOCKET.emit('joinRoom', notifId, date);
    __HUB_SOCKET.emit('updateNotif', notifId);
}

function sendMsg(msg) {
    __SOCKET.emit('msgSent', msg);
}
// 
function switchUser(notifId) {
    if (__PEER != null) {
        __PEER.destroy();
        document.getElementById('clientVideo').srcObject = null;
        document.getElementById('remoteVideo').srcObject = null;
    }
    __SOCKET.emit('joinRoom', notifId);
}
// 
// 
async function streaminit() {
    ready = false;
    // 
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });
    // 
    document.getElementById('clientVideo').srcObject = stream;
    // 
    __PEER = new SimplePeer({
        initiator: true,
        stream: stream,
        trickle: false
    })
    // 
    __PEER.on('signal', function (data) {
        if (!ready)
            __SOCKET.emit('liveStreamLink', data);
    });
    // 
    __PEER.on('stream', function (stream) {
        console.log('stream()');
        document.getElementById('remoteVideo').srcObject = stream;
        document.getElementById('remoteVideoPoster').style.display = "none";
    });
    // 
}
// 
function endCall() {
    if (__PEER != null) {
        __PEER = null;
        document.getElementById('clientVideo').srcObject = null;
        document.getElementById('remoteVideo').srcObject = null;
        // 
        document.getElementById('remoteVideoPoster').style.display = "flex";
    }
    __SOCKET.emit('endCall');
}