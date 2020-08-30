async function render_end_game() {
    return new Promise((resolve, reject) => {
        const container = make_E('div', null, {
            class: 'cons_endGame',
            id: 'endGame_container'
        });
        // 
        const label = make_E('label', `Votre commantaire :`, {
            class: 'endGame_txt',
            for: 'conComment'
        });
        const txtArea = make_E('textarea', null, {
            id: 'conComment',
            class: 'endGame_input'
        });
        const btn_main = make_E('input', null, {
            type: 'button',
            value: 'Terminer',
            class: 'endGame_btn',
            id: 'btnEnd'
        });
        btn_main.addEventListener('click', async () => {
            if (await toastConfirmWarning())
                resolve({
                    content: txtArea.value
                });
            else
                resolve(false);
            container.remove();
        });
        // 
        const btn_sec = make_E('input', null, {
            type: 'button',
            value: 'Anuller',
            class: 'endGame_btn',
            id: 'btn_dont_End'
        });
        btn_sec.addEventListener('click', () => {
            container.remove();
            resolve(false);
        });
        // 
        const form_info = make_E('span', `*Un rapport sera généré automatiquement`, {
            class: 'endGame_desc'
        });
        // 
        container.appendChild(label);
        container.appendChild(txtArea);
        container.appendChild(btn_main);
        container.appendChild(btn_sec);
        container.appendChild(form_info);
        // 
        if (!document.getElementById('endGame_container'))
            document.getElementById('chatingSection').appendChild(container);
    });
}