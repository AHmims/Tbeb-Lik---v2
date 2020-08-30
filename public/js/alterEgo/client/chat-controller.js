$().ready(() => {
    document.addEventListener('click', (e) => {
        console.log(e.target);
    });
    // 
    $('#btnEnd').click(async () => {
        const urlArray = window.location.href.split('/');
        const reqRes = await sendRequest(`/api/finalizeConsultation`, {
            conComment: $('#conComment').val(),
            preConsId: urlArray[urlArray.length - 1].split('?')[0]
        });
        console.log(reqRes);
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
            }
            alert(`REPORT GENERATED => ${reqRes.content}`);
        } else console.error(reqRes.content);
    });
    // VIDEO CHAT
    $('#initCall').click(async () => {
        await streaminit();
    });
    // 
    $('#chat_top_menu_btn').click(mobile_funcs_menu_controller);
    // 
    $('#show_conc_form').click(() => {
        mobile_funcs_menu_controller();

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