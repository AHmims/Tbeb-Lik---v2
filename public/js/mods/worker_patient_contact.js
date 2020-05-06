document.getElementById('msgSend').addEventListener('click', () => {
    // console.log('click');
    sendMsg(document.getElementById('msgInput').value);
    // 
    let msg = {
        Matricule_emmeter: sessionStorage.getItem('user_M'),
        contenu: document.getElementById('msgInput').value,
        roomId: null,
        date_envoi: new Date(Date.now()),
        type: 'Text',
        id_pieceJointes: null
    }
    createMsgBox(msg, 'sentMessage');
    // 
    document.getElementById('msgInput').value = "";
});
// 
function displayReceivedMsg(msg) {
    createMsgBox(msg, 'receivedMessage');
}
// 
function createMsgBox(msg, type) {
    var container = document.createElement('div');
    container.setAttribute('class', `messageContainer ${type}`);
    var txt = document.createElement('span');
    txt.innerText = msg.contenu;
    // 
    container.appendChild(txt);
    document.getElementsByClassName('chatSectionMessages')[0].appendChild(container);
}