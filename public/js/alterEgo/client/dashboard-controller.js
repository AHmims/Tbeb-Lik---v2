$().ready(() => {
    // 
    share_ref();
    // 
    $('.notif_box').each(function (i, element) {
        const _BOX_ID = $(this).attr('id');
        const _VISITOR_ID = document.getElementsByClassName('notif_box_user')[i].getAttribute('id');
        // 
        const btnSet = appendBtnSet(_BOX_ID, _VISITOR_ID, (notifId, visitorId, notifData) => {
            console.log('Accept');
            _SOCKET_ACCEPT_NOTIFICATION(notifId, visitorId, notifData);
        }, (notifId, visitorId, notifData) => {
            console.log('Refuse');
            _SOCKET_REFUSE_NOTIFICATION(notifId, visitorId, notifData);
        });
        $(this).append(btnSet);
    });
});
// 
function acceptNotification(notifId, visitorId) {
    // const consulElement = await sendRequest(`/api/acceptPrecons`, {
    //     preConsId: rootId
    // });
    // // 
    // _SOCKET_ACCEPT_NOTIFICATION(notifId, visitorId);
}

function remove_precons(notifId) {
    if (document.getElementById(notifId))
        document.getElementById(notifId).remove();
}
// 
const share_ref = () => {
    const share_btn = document.getElementById('refBtn_share');
    if (share_btn) {
        share_btn.addEventListener('click', () => {
            // if (navigator.share) {
            // Implement Later
            // } else {
            // }
            // 
            const ref_code = document.getElementById('refCode');
            // 
            ref_code.focus();
            ref_code.select();
            let successful = document.execCommand('copy');
            if (success) {
                ref_code.blur();
                success();
            }

        });
    }
    // 
    function success() {
        const old_content = share_btn.innerHTML;
        share_btn.innerHTML = "&#10004;";
        setTimeout(() => {
            share_btn.innerHTML = old_content;
        }, 3000);
    }
}