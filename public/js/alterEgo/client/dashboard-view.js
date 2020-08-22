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
                // const reqRes = await sendRequest(`/api/acceptPrecons`, {
                //     preConsId: notificationData.preConsId,
                //     userTZ: getTimeZone()
                // });
                // resolve(reqRes);
                resolve(true);
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