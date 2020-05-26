function createMsgBox(msg, type) {
    var container = document.createElement('div');
    container.setAttribute('class', `messageContainer ${type}`);
    var txt = document.createElement('span');
    console.log(msg);
    if (msg.type == 'document') {
        txt = document.createElement('a');
        txt.setAttribute('href', `/${msg.pieceJointes}`);
        txt.setAttribute('download', 'true');
        txt.innerHTML = `<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> ${msg.contenu}`;
        txt.setAttribute('class', 'msgTxtLink');
    } else if (msg.type.toLowerCase() == 'text')
        txt.innerText = msg.contenu;
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
function videoChatIconsControlls() {
    document.getElementById('chatCamBtn').children[0].style.display = "block";
    document.getElementById('chatCamBtn').children[1].style.display = "none";
    document.getElementById('chatMicBtn').children[0].style.display = "block";
    document.getElementById('chatMicBtn').children[1].style.display = "none";
}