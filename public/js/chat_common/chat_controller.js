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
        // video_container_posters_controller();
        // video_container_display_controller();
    });
    $('#toggleCam').click(function () {
        let img_path = `/public/icon/cam_${$(this).attr('data-on') != "true" ? 'on' : 'off'}.svg`;
        document.getElementById('toggleCam').children[0].setAttribute('src', img_path);
        $(this).attr('data-on', $(this).attr('data-on') == "true" ? "false" : "true");
        // 
        camControll();
    });
    $('#toggleMic').click(function () {
        let img_path = `/public/icon/mic_${$(this).attr('data-on') != "true" ? 'on' : 'off'}.svg`;
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
    // console.log(reqRes);
    if (reqRes.code == 200) {
        msgError = false;
        msgData = reqRes.content;
        sendMessage(reqRes.content);
    } else if (reqRes.code == 422)
        await logError(reqRes.content.data);
    else
        logServerError();
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
// 
// 
function video_container_display_controller() {
    const videoChat_container = document.getElementById('videoConfSection');
    // 
    videoChat_container.style.display = videoChat_container.getAttribute('data-visible') == 'false' ? 'block' : 'none';
    // 
    videoChat_container.setAttribute('data-visible', videoChat_container.getAttribute('data-visible') == 'false' ? 'true' : 'false');
}
// 
function video_container_posters_controller() {
    const visible = document.getElementById('videoConfSection').getAttribute('data-poster') == 'true' ? true : false;
    // let posters = document.getElementsByClassName('video_poster');
    // 
    let poster = document.getElementById('remote_video_poster');
    visible ? poster.classList.add('hide_me') : poster.classList.remove('hide_me');
    // for (let i = 0; i < posters.length; i++) {
    // visible ? posters[i].classList.add('hide_me') : posters[i].classList.remove('hide_me');
    // }
    // 
    document.getElementById('videoConfSection').setAttribute('data-poster', !visible);
}

function video_container_posters_controller_SHOW() {
    let poster = document.getElementById('remote_video_poster');
    poster.classList.remove('hide_me');
    document.getElementById('videoConfSection').setAttribute('data-poster', true);
}

function video_container_posters_controller_HIDE() {
    let poster = document.getElementById('remote_video_poster');
    poster.classList.add('hide_me');
    document.getElementById('videoConfSection').setAttribute('data-poster', false);
}