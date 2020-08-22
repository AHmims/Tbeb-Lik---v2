const renderNotification = (root, notificationData) => {
    return new Promise((resolve, reject) => {
        try {
            const boxContainer = make_E('div');
            for (const key in notificationData) {
                if (notificationData.hasOwnProperty(key)) {
                    const value = notificationData[key];
                    const rowContainer = make_E('div');
                    rowContainer.appendChild(make_E('span', `${key} : `));
                    if (Array.isArray(value)) {
                        const valueArrayCont = make_E('div');
                        for (const col of value) {
                            const colElement = make_E('span', col[Object.keys(col)[0]]);
                            valueArrayCont.appendChild(colElement);
                        }
                        rowContainer.appendChild(valueArrayCont);
                    } else rowContainer.appendChild(make_E('span', value));
                    // 
                    boxContainer.appendChild(rowContainer);
                }
            }
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
                        preConsId: notificationData.preConsId,
                        conDate: formRes.date,
                        conCmnt: formRes.comment,
                        userTZ: getTimeZone()
                    });
                    console.log(reqRes);
                    // resolve(reqRes);
                    // resolve(true);
                }
            });
            // 
            let refuseBtn = make_E('input', null, {
                type: 'button',
                class: 'btnRefuse',
                value: 'Refuse'
            })
            refuseBtn.addEventListener('click', () => {
                resolve(false)
            });
            // 
            boxContainer.appendChild(acceptBtn);
            boxContainer.appendChild(refuseBtn);
            // 
            root.appendChild(boxContainer);
        } catch (err) {
            console.error(err);
            resolve(null);
        }
    });
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