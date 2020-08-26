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
            const urlArray = window.location.href.split('/');
            const reqRes = await sendRequest(`/api/newTextMessage`, {
                msgContent: `Rapport`,
                userTZ: getTimeZone(),
                preConsId: urlArray[urlArray.length - 1].split('?')[0],
                msgType: 'report',
                msgPath: reqRes.content
            });
            if (reqRes.code == 200) {
                sendMessage(reqRes.content);
                chat_newMessage(reqRes.content, false);
            }
            alert(`REPORT GENERATED => ${reqRes.content}`);
        } else console.error(reqRes.content);
    });
});
// 