function createMsgBox(msg, type) {
    var txt = document.createElement('h4');
    txt.setAttribute('class', `msgTxt ${type}`);
    txt.innerText = msg.CONTENU;
    // 
    document.getElementById('msgsCont').appendChild(txt);
}