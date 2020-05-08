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
    createMsgBox(msg, 'msgHost');
    // 
    document.getElementById('chatInput').value = "";

});
// 
function displayReceivedMsg(msg) {
    createMsgBox(msg, 'msgRemote');
}