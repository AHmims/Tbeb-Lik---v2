$(document).ready(async () => {
    const _URL_PARAMS = new URLSearchParams(window.location.search);
    const roomMedcin = _URL_PARAMS.get('room');
    // 
    document.getElementById('navChatUrl').setAttribute('href', window.location.href);
    // 
    await joinRoom();
    // 
    let msgs = await $.post('/getMesssages', {
        matricule: localStorage.getItem('matricule'),
        room: roomMedcin
    }).promise();
    // 
    if (msgs != 'platformFail') {
        msgs = JSON.parse(msgs);
        // console.log(msgs);
        // 
        for (let i = 0; i < msgs.length; i++) {
            let type = 'receivedMessage';
            if (msgs[i].MATRICULE_EMETTEUR.toUpperCase() == localStorage.getItem('matricule').toUpperCase())
                type = 'sentMessage';
            // 
            createMsgBox(msgs[i], type);
        }
        scrollDown();
    } else await logServerError();
    // 
    // SEND MSG BTN
    document.getElementById('chatSendBtn').addEventListener('click', () => {
        sendMsgFunc();
    });
    document.getElementById('chatInput').addEventListener('keyup', (e) => {
        if (e.keyCode == 13)
            sendMsgFunc();
    });
    // 
    document.getElementById('patientSubmit').addEventListener('click', async () => {
        let btnRes = await toastConfirmWarning();
        if (btnRes) {
            let finaleResult = await $.post('/finalizeConsultation', {
                matricule: localStorage.getItem('matricule'),
                room: roomMedcin
            }).promise();
            if (finaleResult != 'platformFail') {
                // 
                console.log(`patientSubmit() | finaleResult => `, finaleResult);
                // 
                if (finaleResult == 'False')
                    logError('Erreur!');
                else {
                    logToast('La consultation est terminée, vous serez redirigé dans 3 secondes');
                    setTimeout(() => {
                        window.location.assign('/medecin/notifications');
                    }, 3000);
                }
            } else await logServerError();
        }
    });
    // 
    document.getElementById('chatVideoBtn').addEventListener('click', async () => {
        document.getElementById('videoSection').style.display = "flex";
        videoChatIconsControlls();
        await streaminit();
    });
    // 
    document.getElementById('videoControl-btnEnd').addEventListener('click', () => {
        document.getElementById('videoSection').style.display = "none";
        endCall();
    });
    // 
    document.getElementById('chatMicBtn').addEventListener('click', () => {
        micControll();
    });
    document.getElementById('chatCamBtn').addEventListener('click', () => {
        camControll();
    });
});
// 
function displayReceivedMsg(msg) {
    createMsgBox(msg, 'receivedMessage');
    scrollDown();
}
// 
function sendMsgFunc() {
    sendMsg(document.getElementById('chatInput').value);
    // 
    let msg = {
        MATRICULE_EMETTEUR: localStorage.getItem('user_M'),
        CONTENU: document.getElementById('chatInput').value,
        ID_ROOM: null,
        DATE_ENVOI: new Date().toJSON().slice(0, 19).replace('T', ' '),
        TYPE: 'Text',
        ID_PIECEJOINTES: null
    }
    createMsgBox(msg, 'sentMessage');
    // 
    document.getElementById('chatInput').value = "";
    // 
    scrollDown();
}