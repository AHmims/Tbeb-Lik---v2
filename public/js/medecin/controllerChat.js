$(document).ready(async () => {
    let msgs = await $.post('/getMesssages', {
        matricule: sessionStorage.getItem('matricule')
    }).promise();
    // 
    msgs = JSON.parse(msgs);
    // 
    for (let i = 0; i < msgs.length; i++) {
        let type = 'receivedMessage';
        if (msgs[i].MATRICULE_EMETTEUR == sessionStorage.getItem('matricule'))
            type = 'sentMessage';
        // 
        createMsgBox(msgs[i], type);
    }
    // 
    // SEND MSG BTN
    document.getElementById('chatSendBtn').addEventListener('click', () => {
        sendMsg(document.getElementById('chatInput').value);
        // 
        let msg = {
            MATRICULE_EMETTEUR: sessionStorage.getItem('user_M'),
            CONTENU: document.getElementById('chatInput').value,
            ID_ROOM: null,
            DATE_ENVOI: new Date(Date.now()),
            TYPE: 'Text',
            ID_PIECEJOINTES: null
        }
        createMsgBox(msg, 'sentMessage');
        // 
        document.getElementById('chatInput').value = "";

    });
    // 
    document.getElementById('chatVideoBtn').addEventListener('click', async () => {
        document.getElementById('videoSection').style.display = "flex";
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
}