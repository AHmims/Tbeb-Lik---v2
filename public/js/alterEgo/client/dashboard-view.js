const renderNotification = (root, notificationData, callback_S, callback_R) => {
    const boxContainer = make_E('div', null, {
        id: notificationData.preConsId,
        class: 'notif_box'
    });
    // 
    let _row = make_E('ul', null, {
        id: notificationData.visitorId
    });
    let _col_key = make_E('li', 'Nom :');
    let _col_value = make_E('li', notificationData.name);
    _row.appendChild(_col_key);
    _row.appendChild(_col_value);
    boxContainer.appendChild(_row);
    // 
    _row = make_E('ul');
    _col_key = make_E('li', `Date d'envoi :`);
    _col_value = make_E('li', notificationData.preConsDateCreation);
    _row.appendChild(_col_key);
    _row.appendChild(_col_value);
    boxContainer.appendChild(_row);
    // 
    _row = make_E('ul');
    _col_key = make_E('li', `Telephone :`);
    _col_value = make_E('li', notificationData.tel);
    _row.appendChild(_col_key);
    _row.appendChild(_col_value);
    boxContainer.appendChild(_row);
    // 
    _row = make_E('ul');
    _col_key = make_E('li', `Title :`);
    _col_value = make_E('li', notificationData.preConsTitle);
    _row.appendChild(_col_key);
    _row.appendChild(_col_value);
    boxContainer.appendChild(_row);
    // 
    _row = make_E('ul');
    _col_key = make_E('li', `Description :`);
    _col_value = make_E('li', notificationData.preConsDesc);
    _row.appendChild(_col_key);
    _row.appendChild(_col_value);
    boxContainer.appendChild(_row);
    // 
    _row = make_E('ul');
    _col_key = make_E('li', `Files :`);
    _row.appendChild(_col_key);
    for (const doc of notificationData.docs) {
        _col_value = make_E('a', doc.name, {
            href: doc.url
        });
        _row.appendChild(_col_value);
    }
    boxContainer.appendChild(_row);
    // 
    boxContainer.appendChild(appendBtnSet(notificationData.preConsId, notificationData.visitorId, callback_S, callback_R, root));
    // 
    root.appendChild(boxContainer);
}
// 
// 
function appendBtnSet(rootId, visitorId, callback_S, callback_R, root = document.getElementById('clientInbox')) {
    const container = make_E('div');
    let acceptBtn = make_E('input', null, {
        type: 'button',
        class: 'btnAccept',
        value: 'Accept'
    });
    acceptBtn.addEventListener('click', async () => {
        const formRes = await renderConsultationForm(root);
        // console.log(formRes);
        if (formRes == null || formRes == false)
            console.error(formRes);
        else {
            const reqRes = await sendRequest(`/api/acceptPrecons`, {
                preConsId: rootId,
                conDate: formRes.date,
                conCmnt: formRes.comment,
                userTZ: getTimeZone()
            });
            console.log(reqRes);
            // 
            if (reqRes.code == 200) {
                document.getElementById(rootId).remove();
                // 
                renderConsultation(reqRes.content.data);
                // 
                callback_S(rootId, visitorId, reqRes.content.data);
            } else console.error('Verifer les champs entrée et réessayez.');
        }
    });
    // 
    let refuseBtn = make_E('input', null, {
        type: 'button',
        class: 'btnRefuse',
        value: 'Refuse'
    })
    refuseBtn.addEventListener('click', async () => {
        // resolve(false)
        const reqRes = await sendRequest(`/api/refusePrecons`, {
            preConsId: rootId
        });
        console.log(reqRes);
        if (reqRes.code == 200) {
            document.getElementById(rootId).remove();
            // 
            callback_R(rootId, visitorId, reqRes.content.data);
        } else console.error('Server ERROR.');
    });
    // 
    container.appendChild(acceptBtn);
    container.appendChild(refuseBtn);
    // 
    return container;
}
// 
const renderConsultationForm = root => {
    return new Promise((resolve, reject) => {
        try {
            const formContainer = make_E('div');
            // 
            let row = make_E('div');
            const dateLabel = make_E('span', 'Select a date :');
            const dateInput = make_E('input', null, {
                type: 'date'
            });
            row.appendChild(dateLabel);
            row.appendChild(dateInput);
            formContainer.appendChild(row);
            // 
            const commentLabel = make_E('span', 'A comment :');
            const commentInput = make_E('textarea');
            row = make_E('div');
            row.appendChild(commentLabel);
            row.appendChild(commentInput);
            formContainer.appendChild(row);
            // 
            row = make_E('div');
            const sendbtn = make_E('input', null, {
                type: 'button',
                class: 'conFormBtn',
                value: 'Envoyer'
            });
            sendbtn.addEventListener('click', () => {
                resolve({
                    date: dateInput.value,
                    comment: commentInput.value
                });
                formContainer.remove();
            });
            // 
            const cancellBtn = make_E('input', null, {
                type: 'button',
                value: 'Anuller'
            });
            cancellBtn.addEventListener('click', () => {
                formContainer.remove();
                resolve(false);
            });
            // 
            row.appendChild(sendbtn);
            row.appendChild(cancellBtn);
            // 
            formContainer.appendChild(row);
            root.appendChild(formContainer);
        } catch (err) {
            console.error(err);
            return null;
        }
    });
}
// 
const renderConsultation = data => {
    const container = make_E('div');
    // 
    let row = make_E('ul', null, {
        class: 'consul_box',
        data_id: data.preConsId
    });
    let col_value = make_E('li', data.nom);
    row.appendChild(col_value);
    container.appendChild(row);
    // 
    row = make_E('ul');
    col_value = make_E('li', data.preConsDateCreation);
    row.appendChild(col_value);
    container.appendChild(row);
    // 
    row = make_E('ul');
    col_value = make_E('li', data.preConsTitle);
    row.appendChild(col_value);
    container.appendChild(row);
    // 
    row = make_E('ul');
    col_value = make_E('li', data.preConsDesc);
    row.appendChild(col_value);
    container.appendChild(row);
    // 
    row = make_E('ul');
    let col_cont = make_E('li');
    for (const doc of data.docs) {
        col_value = make_E('a', doc.attachmentName, {
            href: `/files/${data.visitorId}/${doc.attachmentName}`
        });
        col_cont.appendChild(col_value);
    }
    row.appendChild(col_cont);
    container.appendChild(row);
    // 
    let btn = make_E('a', 'Contacter', {
        href: `/chat/${data.preConsId}`
    });
    container.appendChild(btn);
    // 
    document.getElementById('clientConsul').appendChild(container);
}