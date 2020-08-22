const renderNotification = (root, notificationData, callback_S, callback_F) => {
    const boxContainer = make_E('div');
    // 
    let _row = make_E('ul');
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
    boxContainer.appendChild(appendBtnSet(notificationData.preConsId, callback_S, callback_F, root));
    // 
    root.appendChild(boxContainer);
}
// 
// 
function appendBtnSet(rootId, callback_S, callback_F, root = document.getElementById('clientInbox')) {
    const container = make_E('div');
    let acceptBtn = make_E('input', null, {
        type: 'button',
        class: 'btnAccept',
        value: 'Accept'
    });
    acceptBtn.addEventListener('click', async () => {
        const formRes = await renderConsultationForm(root);
        console.log(formRes);
        if (formRes == null || formRes == false)
            resolve(formRes);
        else {
            const reqRes = await sendRequest(`/api/acceptPrecons`, {
                preConsId: rootId,
                conDate: formRes.date,
                conCmnt: formRes.comment,
                userTZ: getTimeZone()
            });
            console.log(reqRes);
            // resolve(reqRes);
            // resolve(true);
        }
        callback_S();
    });
    // 
    let refuseBtn = make_E('input', null, {
        type: 'button',
        class: 'btnRefuse',
        value: 'Refuse'
    })
    refuseBtn.addEventListener('click', () => {
        // resolve(false)
        callback_F();
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