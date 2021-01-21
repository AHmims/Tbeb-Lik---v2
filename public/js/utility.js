function getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
// 
async function sendRequest(url, data, type = null) {
    return new Promise(async (resolve, reject) => {
        try {
            $.ajax({
                url: url,
                type: "post",
                data: data,
                processData: type != null ? false : true,
                contentType: type != null ? false : 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(resp => {
                resolve({
                    code: 200,
                    content: resp.data
                });
            }).fail(resp => {
                // resolve(errorhandler(resp.status));
                resolve({
                    code: resp.status,
                    content: resp.responseText != '' ? JSON.parse(resp.responseText) : null
                });
            });
        } catch (err) {
            // console.error(err);
            await logError(err);
            resolve(null);
        }
    });
}
// FOR REQUESTS
async function errorhandler(err) {
    switch (err) {
        case 400:
        case 401:
        case 403:
        case 404:
        case 405:
        case 422:
        case 500:
            // console.error(err);
            await logError(err);
            break;
        default:
            // console.error('error while executing your request');
            await logServerError();
            break;
    }
    return null;
}
// MAKE AN ELEMENT AND RETURN IT
function make_E(elem_type, text = null, attribs = null) {
    try {
        const retElement = document.createElement(elem_type);
        if (attribs != null) {
            if (typeof attribs === 'object') {
                for (const key in attribs) {
                    if (attribs.hasOwnProperty(key)) {
                        const value = attribs[key];
                        retElement.setAttribute(key, value);
                    }
                }
            }
        }
        if (text != null)
            retElement.innerText = text;
        // 
        return retElement;
    } catch (err) {
        // console.error(err);
        logError(err);
        return null;
    }
}
// 
function getNotifId() {
    const urlData = window.location.href.split('/');
    return urlData[urlData.length - 1];
}
// 
function makeEmptyContainer() {
    const container = make_E('div', null, {
        class: 'empty_banner'
    });
    const img = make_E('img', null, {
        src: '/public/icon/sad_face.svg',
        alt: 'sad_face'
    });
    const txt = make_E('span', 'Liste vide');
    // 
    container.appendChild(img);
    container.appendChild(txt);
    // 
    return container;
}