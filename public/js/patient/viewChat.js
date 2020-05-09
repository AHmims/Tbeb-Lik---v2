function createMsgBox(msg, type) {
    var container = document.createElement('div');
    container.setAttribute('class', `messageContainer ${type}`);
    var txt = document.createElement('span');
    txt.innerText = msg.CONTENU;
    // 
    container.appendChild(txt);
    document.getElementById('msgsCont').appendChild(container);
}
// 
function controllPosters(style) {
    document.getElementById('remoteVideoPoster').style.display = style;
    document.getElementById('hostVideoPoster').style.display = style;
}
// 
function switchIconMic(state) {
    document.getElementById('chatMicBtn').children[+(state)].style.display = "block";
    document.getElementById('chatMicBtn').children[+(!(+(state)))].style.display = "none";
}

function switchIconCam(state) {
    document.getElementById('chatCamBtn').children[+(state)].style.display = "block";
    document.getElementById('chatCamBtn').children[+(!(+(state)))].style.display = "none";
} // 