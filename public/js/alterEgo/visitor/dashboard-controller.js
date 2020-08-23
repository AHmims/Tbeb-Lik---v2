$().ready(() => {
    $('#sendForm').click(async () => {
        const conForm = new FormData();
        conForm.append('conTitle', $('#conTitle').val());
        conForm.append('conDesc', $('#conDesc').val());
        conForm.append('conTZ', getTimeZone());
        for (const formFile of $('#conFile')[0].files) {
            conForm.append('conFile', formFile);

        }
        // console.log($('#conFile')[0].files);
        // console.log(conForm.get('conDesc'));
        try {
            const reqRes = await sendRequest(`/api/savePrecons`, conForm, 'form');
            if (reqRes != null) {
                // LOGIC
                console.log(reqRes);
                // 
                if (reqRes.code == 200) { //success
                    sendPreCons(reqRes.content);
                    console.log(`!! Waiting !!`);
                } else {
                    if (reqRes.content != null && reqRes.content != 'null') {
                        for (const error of reqRes.content.data) {
                            console.log(`ERROR => ${error}`);
                        }
                    } else throw reqRes.code;
                }
            }
        } catch (err) {
            console.log(err);
            errorhandler(null);
        }

    });
    // 
    $('#cancelPrecons').click(async () => {
        // SEND POST REQUEST TO UPDATE DB
        const response = await sendRequest(`/api/cancelPrecons`, {});
        console.log(response);
        if (response.code == 200) {
            cancelPrecons
        }
    });
});
// 