$().ready(() => {
    $('#sendForm').click(() => {
        const conForm = new FormData();
        conForm.append('conTitle', $('#conTitle').val());
        conForm.append('conDesc', $('#conDesc').val());
        conForm.append('conFile', $('#conFile')[0].files);
        // console.log($('#conFile')[0].files);
        // console.log(conForm.get('conDesc'));
        $.ajax({
            url: '/api/test',
            type: "post",
            data: conForm,
            processData: false,
            contentType: false
            // success: (resp) => {
            // console.log(resp);
            // },
            // fail: (resp) => {
            // console.log('fail');
            // }
        }).then((resp) => {
            console.log(resp);
        }).fail((resp) => {
            console.log('err');
        });
    });
});