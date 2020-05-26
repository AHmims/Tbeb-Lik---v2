$(document).ready(async () => {
    const _URL_PARAMS = new URLSearchParams(window.location.search);
    const roomMedcin = _URL_PARAMS.get('room');
    const patientMatricule = _URL_PARAMS.get('patient');
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
            if (msgs[i].Matricule_emmeter.toUpperCase() == localStorage.getItem('matricule').toUpperCase())
                type = 'sentMessage';
            // 
            createMsgBox(msgs[i], type);
        }
        scrollDown();
    } else await logServerError();
    // 
    // 
    let roomActive = await $.post('/roomActiveCheck', {
        matricule: localStorage.getItem('matricule'),
        room: roomMedcin
    }).promise();
    if (roomActive != 'platformFail') {
        if (roomActive == 'false')
            document.getElementsByClassName('bottomTableMedecin')[0].style.display = "none";
    } else await logServerError();
    // 
    // SEND MSG BTN
    document.getElementById('chatSendBtn').addEventListener('click', () => {
        sendMsgFunc(document.getElementById('chatInput').value, "text");
        document.getElementById('chatInput').value = "";
    });
    document.getElementById('chatInput').addEventListener('keyup', (e) => {
        if (e.keyCode == 13) {
            sendMsgFunc(document.getElementById('chatInput').value, "text");
            document.getElementById('chatInput').value = "";
        }
    });
    // 
    document.getElementById('patientSubmit').addEventListener('click', async () => {
        let btnRes = await toastConfirmWarning();
        if (btnRes) {
            let patientData = await $.post('/patientChatBasicData', {
                matricule: patientMatricule
            }).promise();
            patientData = JSON.parse(patientData);
            if (patientData.length > 0) {
                patientData = patientData[0];
                var submitState = await createSubmitWindow(patientData);
                if (submitState.state) {
                    logToastActive("Votre demande est en cours d'execution, merci de patienter quelques instants");
                    let finaleResult = await $.post('/finalizeConsultation', {
                        matricule: localStorage.getItem('matricule'),
                        room: roomMedcin,
                        patientId: patientMatricule,
                        data: submitState.data
                    }).promise();
                    if (finaleResult != 'platformFail') {
                        finaleResult = JSON.parse(finaleResult);
                        console.log(`patientSubmit() | finaleResult => `, finaleResult);
                        // 
                        if (!finaleResult.status)
                            logError('Erreur!');
                        else {
                            sendMsgFunc(finaleResult.filename, "document", finaleResult.downloadLink);
                            logToast('La consultation est terminée, vous serez redirigé dans 3 secondes');
                            setTimeout(() => {
                                window.location.assign('/medecin/notifications');
                            }, 3000);
                        }
                    } else await logServerError();
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
function sendMsgFunc(txtMsg, type, file = null) {
    sendMsg(txtMsg, type, file);
    // 
    let msg = {
        Matricule_emmeter: localStorage.getItem('user_M'),
        contenu: txtMsg,
        roomId: null,
        date_envoi: new Date().toJSON().slice(0, 19).replace('T', ' '),
        type: type,
        pieceJointes: file
    }
    createMsgBox(msg, 'sentMessage');
    // 
    // document.getElementById('chatInput').value = "";
    // 
    scrollDown();
}