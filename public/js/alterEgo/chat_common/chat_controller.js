$().ready(() => {
    scrollDown();
    // TEXT MESSAGES
    $('#msgSend').click(chat_sendMessage);
    $('#msgInput').on('keyup', (e) => {
        if (e.key === "Enter")
            chat_sendMessage();
    });
    $('#endCall').click(() => {
        endCall();
    });
    $('#toggleCam').click(function () {
        let img_path = `/public/icon/alterego/cam_${$(this).attr('data-on') != "true" ? 'on' : 'off'}.svg`;
        document.getElementById('toggleCam').children[0].setAttribute('src', img_path);
        $(this).attr('data-on', $(this).attr('data-on') == "true" ? "false" : "true");
        // 
        camControll();
    });
    $('#toggleMic').click(function () {
        let img_path = `/public/icon/alterego/mic_${$(this).attr('data-on') != "true" ? 'on' : 'off'}.svg`;
        document.getElementById('toggleMic').children[0].setAttribute('src', img_path);
        $(this).attr('data-on', $(this).attr('data-on') == "true" ? "false" : "true");
        // 
        micControll();
    });
});
// 
async function chat_sendMessage() {
    const msgContent = $('#msgInput').val();
    let msgError = true;
    let msgData = {
        msgContent: msgContent,
        msgType: 'text'
    };
    // 
    const urlArray = window.location.href.split('/');
    // 
    const reqRes = await sendRequest(`/api/newTextMessage`, {
        msgContent: msgContent,
        userTZ: getTimeZone(),
        preConsId: urlArray[urlArray.length - 1].split('?')[0]
    });
    console.log(reqRes);
    if (reqRes.code == 200) {
        msgError = false;
        msgData = reqRes.content;
        sendMessage(reqRes.content);
    }
    chat_newMessage(msgData, false, msgError);
    // 
    $('#msgInput').val('');
}

function chat_newMessage(msgData, incoming, msgError = false) {
    // incoming == true => Message recieved | ELSE | Message sent
    document.getElementById('chatMessages').appendChild(renderMessage(msgData, incoming, msgError));
    scrollDown();
}
// 
function scrollDown() {
    let cont = document.getElementById('chatMessages');
    cont.scrollTo(0, cont.scrollHeight);
}