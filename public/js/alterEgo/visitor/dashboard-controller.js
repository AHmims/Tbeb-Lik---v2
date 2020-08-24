$().ready(() => {
    $('#sendForm').click(listener_sendForm);
    // 
    $('#cancelPrecons').click(listener_cancelPrecons);
});
// EVENT LISTENERS
async function listener_sendForm() {
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
                socket_sendPreCons(reqRes.content);
                remove_preconsForm();
                display_onHold();
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
}

async function listener_cancelPrecons() {
    // SEND POST REQUEST TO UPDATE DB
    const response = await sendRequest(`/api/cancelPrecons`, {});
    console.log(response);
    if (response.code == 200) {
        remove_onHold();
        display_preconsForm();
        // 
        socket_cancelPrecons(response.content.notifId, response.content.userId);
    }
}
// 
function remove_onHold() {
    if (document.getElementById('preConsStatus'))
        document.getElementById('preConsStatus').remove();
}

function remove_preconsForm() {
    if (document.getElementById('preConsForm'))
        document.getElementById('preConsForm').remove();
}

/* function remove_consultation() {
    if (document.getElementById('activeCons'))
        document.getElementById('activeCons').remove();
} */
// 
function display_onHold() {
    document.getElementById('rootElement').appendChild(render_onHold());
}

function display_preconsForm() {
    document.getElementById('rootElement').appendChild(render_preconsForm());
}

function display_consultation() {

}