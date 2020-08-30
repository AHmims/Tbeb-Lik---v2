const renderNotification = (root, notificationData, callback_S, callback_R) => {
    const boxContainer = make_E('div', null, {
        id: notificationData.preConsId,
        class: 'notif_box'
    });
    // 
    let _col_value = make_E('span', notificationData.name, {
        id: notificationData.visitorId,
        class: 'notif_box_user'
    });
    boxContainer.appendChild(_col_value);
    // 
    _col_value = make_E('span', notificationData.tel, {
        class: 'notif_box_tel'
    });
    boxContainer.appendChild(_col_value);
    // 
    _col_value = make_E('span', notificationData.preConsDateCreation, {
        class: 'notif_box_date'
    });
    boxContainer.appendChild(_col_value);
    // 
    _col_value = make_E('div', null, {
        class: 'notif_box_sep'
    });
    boxContainer.appendChild(_col_value);
    // 
    _col_value = make_E('span', notificationData.preConsTitle, {
        class: 'notif_box_title'
    });
    boxContainer.appendChild(_col_value);
    //
    _col_value = make_E('span', notificationData.preConsDesc, {
        class: 'notif_box_desc'
    });
    boxContainer.appendChild(_col_value);
    // 
    if (notificationData.docs.length > 0) {
        row = make_E('div', null, {
            class: 'notif_box_files_cont'
        });
        for (const doc of notificationData.docs) {
            let doc_link = make_E('a', null, {
                href: doc.url,
                target: '_blank',
                class: 'notif_box_file'
            });
            let doc_icon = `<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
            stroke="currentColor">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>`;
            let doc_name = doc.name;
            // 
            doc_link.innerHTML = doc_icon;
            doc_link.innerHTML += doc_name;
            // 
            row.appendChild(doc_link);
        }
        boxContainer.appendChild(row);
    }
    // 
    boxContainer.appendChild(appendBtnSet(notificationData.preConsId, notificationData.visitorId, callback_S, callback_R, root));
    // 
    if (document.getElementById('db_c_inbox'))
        document.getElementById('db_c_inbox').appendChild(boxContainer);
    else {
        const b_cont = make_E('div', null, {
            id: 'db_c_inbox',
            class: 'db_c_inbox'
        });
        b_cont.appendChild(boxContainer);
        document.getElementById('clientInbox').appendChild(b_cont);
    }
}
// 
function appendBtnSet(rootId, visitorId, callback_S, callback_R, root = document.getElementById('clientInbox')) {
    const container = make_E('div', null, {
        class: 'notif_box_btns_cont'
    });
    let acceptBtn = make_E('input', null, {
        type: 'button',
        class: 'notif_box_btnAccept',
        value: 'Accepter'
    });
    acceptBtn.addEventListener('click', async () => {
        const formRes = await renderConsultationForm(visitorId);
        // console.log(formRes);
        if (formRes == null || formRes == false)
            logError(`Erreur lors de l'exécution de votre demande`);
        // console.error(formRes);
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
                removeEmptyHolder('activeConsul');
                // 
                renderConsultation(reqRes.content.data);
                // 
                callback_S(rootId, visitorId, reqRes.content.data);
            } else {
                if (reqRes.code == 422)
                    await logErrorActive(reqRes.content)
                else
                    await logServerError();
            }
            // console.error('Verifer les champs entrée et réessayez.');
        }
    });
    // 
    let refuseBtn = make_E('input', null, {
        type: 'button',
        class: 'notif_box_btnRefuse',
        value: 'Réfuser'
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
        } else if (reqRes.code == 422)
            await logErrorActive(reqRes.content);
        else await logServerError();
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
            const formContainer = make_E('div', null, {
                class: 'notif_box_form'
            });
            // 
            let row = make_E('div');
            const dateLabel = make_E('span', 'Select a date :');
            const dateInput = make_E('input', null, {
                type: 'datetime-local'
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
                class: 'notif_box_form_btn notif_box_form_btnM',
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
                class: 'notif_box_form_btn notif_box_form_btnA',
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
            document.getElementById(root).parentElement.appendChild(formContainer);
        } catch (err) {
            console.error(err);
            // logError(err);
            return null;
        }
    });
}
// 
const renderConsultation = data => {
    const container = make_E('div', null, {
        class: 'cons_box'
    });
    // 
    let row = make_E('span', data.nom, {
        class: 'notif_box_user'
    });
    container.appendChild(row);
    // 
    row = make_E('span', data.tel, {
        class: 'notif_box_tel'
    });
    container.appendChild(row);
    // 
    row = make_E('span', data.consulDate, {
        class: 'notif_box_date'
    });
    container.appendChild(row);
    // 
    row = make_E('div', null, {
        class: 'notif_box_sep'
    });
    container.appendChild(row);
    // 
    row = make_E('span', data.preConsTitle, {
        class: 'preConsTitle'
    });
    container.appendChild(row);
    // 
    row = make_E('span', data.preConsDesc, {
        class: 'notif_box_desc'
    });
    container.appendChild(row);
    // 
    if (data.docs.length > 0) {
        row = make_E('div', null, {
            class: 'notif_box_files_cont'
        });
        for (const doc of data.docs) {
            let doc_link = make_E('a', null, {
                href: `/files/${data.visitorId}/${doc.attachmentName}`,
                target: '_blank',
                class: 'notif_box_file'
            });
            let doc_icon = `<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
            stroke="currentColor">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>`;
            let doc_name = doc.attachmentName;
            // 
            doc_link.innerHTML = doc_icon;
            doc_link.innerHTML += doc_name;
            // 
            row.appendChild(doc_link);
        }
        container.appendChild(row);
    }
    // 
    let btns_cont = make_E('div', null, {
        class: 'notif_box_btns_cont'
    })
    let btn = make_E('a', 'Contacter', {
        href: `/chat/${data.preConsId}`,
        class: 'notif_box_btnAccept'
    });
    btns_cont.appendChild(btn);
    container.appendChild(btns_cont);
    // 
    if (document.getElementById('db_c_cons'))
        document.getElementById('db_c_cons').appendChild(container);
    else {
        const cons_container = make_E('div', null, {
            id: 'db_c_cons',
            class: 'db_c_cons'
        });
        cons_container.appendChild(container);
        document.getElementById('activeConsul').appendChild(cons_container);
    }
}