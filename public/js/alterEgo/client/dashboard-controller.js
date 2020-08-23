$().ready(() => {
    $('.notif_box').each(function (i, element) {
        console.log(i);
        const _BOX_ID = $(this).attr('id');
        const _VISITOR_ID = document.getElementsByClassName('notif_box_user')[i].getAttribute('id');
        // 
        const btnSet = appendBtnSet(_BOX_ID, _VISITOR_ID, () => {
            console.log('S')
        }, () => {
            console.log('F')
        });
        $(this).append(btnSet);
    });
});
// 
function acceptNotification(notifId, visitorId) {
    _SOCKET_ACCEPT_NOTIFICATION(notifId, visitorId);
}