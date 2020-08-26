$().ready(() => {
    $('#btnEnd').click(async () => {
        const urlArray = window.location.href.split('/');
        const reqRes = await sendRequest(`/api/finalizeConsultation`, {
            conComment: $('#conComment').val(),
            preConsId: urlArray[urlArray.length - 1].split('?')[0]
        });
        console.log(reqRes);
        // 
        if (reqRes.code == 200) {

        }
    });
});
// 