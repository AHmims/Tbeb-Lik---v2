$().ready(() => {
    $('.notif_box').each(function () {
        const _BOX_ID = $(this).attr('id');
        const btnSet = appendBtnSet(_BOX_ID, () => {
            console.log('S')
        }, () => {
            console.log('F')
        });
        $(this).append(btnSet);
    });
});
// 