function createMsgBox(msg, type) {
    var container = document.createElement('div');
    container.setAttribute('class', `messageContainer ${type}`);
    var txt = document.createElement('span');
    txt.innerText = msg.contenu;
    // 
    container.appendChild(txt);
    document.getElementById('msgsCont').appendChild(container);
}