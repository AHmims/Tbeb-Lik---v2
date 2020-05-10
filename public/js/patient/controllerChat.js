$(document).ready(async () => {
    // SEND MSG BTN
    document.getElementById('chatSendBtn').addEventListener('click', () => {
        sendMsg(document.getElementById('chatInput').value);
        // 
        let msg = {
            MATRICULE_EMETTEUR: localStorage.getItem('user_M'),
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
    document.getElementById('videoControl-btnEnd').addEventListener('click', () => {
        endCall();
        // hideVideoSection();
    });
    // 
    document.getElementById('chatMicBtn').addEventListener('click', () => {
        micControll();
    });
    document.getElementById('chatCamBtn').addEventListener('click', () => {
        camControll();
    });
    // 
    let msgs = await $.post('/getMesssages', {
        matricule: localStorage.getItem('matricule'),
        room: ''
    }).promise();
    // 
    msgs = JSON.parse(msgs);
    // 
    for (let i = 0; i < msgs.length; i++) {
        let type = 'receivedMessage';
        if (msgs[i].MATRICULE_EMETTEUR == localStorage.getItem('matricule'))
            type = 'sentMessage';
        // 
        createMsgBox(msgs[i], type);
    }
});
// 
function displayReceivedMsg(msg) {
    createMsgBox(msg, 'receivedMessage');
}
// 
// 
// 
// 

function showVideoSection() {
    document.getElementById('videoSection').style.display = "block";
    if (document.body.offsetWidth + 17 <= 1200) {
        console.log('in');
        document.getElementById('chatSection').style = "height : 500px !important;border-top-left-radius : 0px;border-top-right-radius : 0px;";
    } else {
        document.getElementById('chatSection').style.width = "475px";
        document.getElementById('chatSection').style.borderTopLeftRadius = "0px";
        document.getElementById('chatSection').style.borderBottomLeftRadius = "0px";
    }
}

function hideVideoSection() {
    document.getElementById('videoSection').style.display = "none";
    document.getElementById('chatSection').style.width = "100%";
    document.getElementById('chatSection').style.borderRadius = "20px";
    if (document.body.offsetWidth + 17 <= 1200) {
        // console.log('in');
        document.getElementById('chatSection').style = "height : initial";
    }
}