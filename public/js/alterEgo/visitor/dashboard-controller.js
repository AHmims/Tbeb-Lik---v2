$().ready(() => {
    $('#sendForm').click(async () => {
        const conForm = new FormData();
        conForm.append('conTitle', $('#conTitle').val());
        conForm.append('conDesc', $('#conDesc').val());
        conForm.append('conFile', $('#conFile')[0].files);
        // console.log($('#conFile')[0].files);
        // console.log(conForm.get('conDesc'));
        try {
            const reqRes = await sendRequest(`/api/test`, conForm, null, null);
            if (reqRes != null) {
                // LOGIC
                console.log(reqRes);
            }
        } catch (err) {
            console.log(err);
            errorhandler(null);
        }

    });
});
// 
function sendRequest(url, data, successCB, failCB) {
    return new Promise((resolve, reject) => {
        try {
            $.ajax({
                url: url,
                type: "post",
                data: data,
                processData: false,
                contentType: false
            }).then(resp => {
                resolve(resp);
            }).fail(resp => {
                resolve(errorhandler(resp.status));
            });
        } catch (err) {
            console.error(err);
            resolve(errorhandler(null));
        }
    });
}
// 
function errorhandler(err) {
    switch (err) {
        case 400:
        case 401:
        case 403:
        case 404:
        case 405:
        case 422:
        case 500:
            console.error(err);
            break;
        default:
            console.error('error while executing your request');
            break;
    }
    return null;
}