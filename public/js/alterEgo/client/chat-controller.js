$().ready(() => {
    // VIDEO CHAT
    $('#initCall').click(async () => {
        if (__PEER == null) {
            video_container_display_controller();
            await streaminit();
        } else {
            // console.warn('Video chat is already on');
            await logWarningActive(`L'appel vidéo est déjà en cours`);
        }
    });
    // 
    $('#chat_top_menu_btn').click(mobile_funcs_menu_controller);
    // 
    $('#show_conc_form').click(async () => {
        mobile_funcs_menu_controller();
        if (!document.getElementById('endGame_container')) {
            const click_res = await render_end_game();
            if (click_res != false) {
                const urlArray = window.location.href.split('/');
                const reqRes = await sendRequest(`/api/finalizeConsultation`, {
                    conComment: click_res.content,
                    preConsId: urlArray[urlArray.length - 1].split('?')[0]
                });
                // console.log(reqRes);
                // 
                if (reqRes.code == 200) {
                    const urlArray = window.location.href.split('/');
                    const msgReqRes = await sendRequest(`/api/newTextMessage`, {
                        msgContent: `Rapport`,
                        userTZ: getTimeZone(),
                        preConsId: urlArray[urlArray.length - 1].split('?')[0],
                        msgType: 'report',
                        msgPath: reqRes.content
                    });
                    if (msgReqRes.code == 200) {
                        sendMessage(msgReqRes.content);
                        chat_newMessage(msgReqRes.content, false);
                    } else if (msgReqRes.code == 422)
                        await logErrorActive(msgReqRes.content);
                    else
                        logServerError();

                    // alert(`REPORT GENERATED => ${reqRes.content}`);
                    await logToastActive(`le rapport a été généré et envoyé à votre client`);
                } else if (reqRes.code == 422)
                    await logErrorActive(reqRes.content);
                else
                    logServerError();
            }
        } else {
            document.getElementById('endGame_container').remove();
        }
    });
});
// 
let mobile_menu_tmout = null;

document.getElementById('chat_top_options_cont').addEventListener('mouseenter', () => {
    if (mobile_funcs_menu_controller != null) {
        clearTimeout(mobile_menu_tmout);
    }
});
document.getElementById('chat_top_options_cont').addEventListener('mouseleave', () => {
    mobile_menu_tmout = setTimeout(() => {
        document.getElementById('chat_top_options_cont').classList.add('hide_me');
    }, 2000);
});

function mobile_funcs_menu_controller() {
    const toggled = document.getElementById('chat_top_options_cont').classList.contains('hide_me');
    if (toggled) {
        document.getElementById('chat_top_options_cont').classList.remove('hide_me');
        mobile_menu_tmout = setTimeout(() => {
            document.getElementById('chat_top_options_cont').classList.add('hide_me');
        }, 2000);
    } else {
        document.getElementById('chat_top_options_cont').classList.add('hide_me');
    }
}