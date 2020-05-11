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
    console.log(localStorage.getItem('matricule'));
    // 
    msgs = JSON.parse(msgs);
    // console.log(msgs);
    // 
    for (let i = 0; i < msgs.length; i++) {
        let type = 'receivedMessage';
        if (msgs[i].MATRICULE_EMETTEUR == localStorage.getItem('matricule'))
            type = 'sentMessage';
        // 
        createMsgBox(msgs[i], type);
    }
    scrollDown();
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
        let finaleResult = await $.post('/finalizeConsultation', {
            matricule: localStorage.getItem('matricule'),
            room: roomMedcin
        }).promise();
        // 
        console.log(`patientSubmit() | finaleResult => `, finaleResult);
        // 
        if (finaleResult == 'False')
            alert('ERROR!');
        else {
            alert('La consultation est terminée, vous serez redirigé dans 3 secondes');
            setTimeout(() => {
                window.location.assign('/medecin/notifications');
            }, 3000);
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