$().ready(() => {
    // TEXT MESSAGES
    $('#msgSend').click(chat_sendMessage);
    $('#msgInput').on('keyup', (e) => {
        if (e.key === "Enter")
            chat_sendMessage();
    });
    // VIDEO CHAT
    $('#initCall').click(async () => {
        await streaminit();
    });
    $('#endCall').click(() => {
        endCall();
    });
    $('#toggleCam').click(() => {
        camControll();
    });
    $('#toggleMic').click(() => {
        micControll();
    });
});
// 
async function chat_sendMessage() {
    const msgContent = $('#msgInput').val();
    let msgError = true;
    let msgData = {
        msgContent: msgContent
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
}