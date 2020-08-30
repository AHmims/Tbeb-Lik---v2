function render_onHold() {
    const container = make_E('div', null, {
        id: 'preConsStatus'
    });
    const title = make_E('h4', `Veuillez patienter, votre demande est en attente d'être prise en charge`);
    const btn = make_E('button', null, {
        id: 'cancelPrecons',
        onclick: `listener_cancelPrecons()`
    });
    const svg_loader = `<svg class="animated_loading" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" />
    </svg>`;
    const btn_text = make_E('span', 'Anuller');
    btn.innerHTML = svg_loader;
    btn.appendChild(btn_text);
    // 
    container.appendChild(title);
    container.appendChild(btn);
    return container;
}
// 
function render_preconsForm() {
    const container = make_E('div', null, {
        id: 'preConsForm',
        class: 'db_v_preConsForm'
    });
    // 
    const container_title = make_E('h1', `Remplir le formulaire pour envoyer un demande de consultation`);
    container.appendChild(container_title);
    // 
    const container_form = make_E('div', null, {
        class: 'db_v_preConsForm_form'
    });
    // 
    let container_form_col = make_E('div', null, {
        class: 'db_v_preCons_form_col'
    });
    // 
    let container_form_row = make_E('div', null, {
        class: 'db_v_preCons_form_row'
    });
    let form_label = make_E('label', `Titre :`, {
        for: 'conTitle',
        class: 'db_v_preCons_form_label'
    });
    let form_input = make_E('input', null, {
        type: 'text',
        class: 'db_v_preCons_input',
        id: 'conTitle',
        required: true
    });
    container_form_row.appendChild(form_label);
    container_form_row.appendChild(form_input);
    container_form_col.appendChild(container_form_row);
    // 
    container_form_row = make_E('div', null, {
        class: 'db_v_preCons_form_row'
    });
    form_label = make_E('label', `Ajouter des documents : :`, {
        for: 'conFile',
        class: 'db_v_preCons_form_label'
    });
    form_input = make_E('input', null, {
        type: 'file',
        class: 'db_v_preCons_input',
        id: 'conFile',
        multiple: true,
        name: 'conFile'
    });
    container_form_row.appendChild(form_label);
    container_form_row.appendChild(form_input);
    container_form_col.appendChild(container_form_row);
    // 
    container_form.appendChild(container_form_col);
    // 
    container_form_col = make_E('div', null, {
        class: 'db_v_preCons_form_col'
    });
    // 
    container_form_row = make_E('div', null, {
        class: 'db_v_preCons_form_row'
    });
    form_label = make_E('label', `Description :`, {
        for: 'conDesc',
        class: 'db_v_preCons_form_label'
    });
    form_input = make_E('textarea', null, {
        class: 'db_v_preCons_input',
        cols: 30,
        rows: 10,
        id: 'conDesc',
        required: true
    });
    container_form_row.appendChild(form_label);
    container_form_row.appendChild(form_input);
    container_form_col.appendChild(container_form_row);
    // 
    container_form_row = make_E('div', null, {
        class: 'db_v_preCons_form_btnsCont'
    });
    let container_form_btn = make_E('button', null, {
        id: 'sendForm',
        class: 'db_v_preCons_form_btn',
        onclick: `listener_sendForm()`
    });
    let form_btn_text = make_E('span', `Envoyer votre demande de consultation`);
    let form_btn_icon = `<svg viewBox="0 0 20 20" fill="currentColor" class="chevron-right w-6 h-6">
    <path fill-rule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clip-rule="evenodd"></path>
    </svg>`;
    container_form_btn.appendChild(form_btn_text);
    container_form_btn.innerHTML += form_btn_icon;
    container_form_row.appendChild(container_form_btn);
    container_form_col.appendChild(container_form_row);
    // 
    container_form.appendChild(container_form_col);
    // 
    container.appendChild(container_form);
    // 
    return container;
}
// 
function render_cons_container() {
    const container = make_E('div', null, {
        id: 'activeCons_container'
    });
    return container;
}
// 
function render_consultation(data) {
    console.log(data);
    const container = make_E('div', null, {
        class: 'history_box'
    });
    // 
    let row = make_E('span', data.preConsTitle, {
        class: 'notif_box_title'
    });
    container.appendChild(row);
    // 
    row = make_E('span', data.consulDate, {
        class: 'notif_box_date'
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
    return container;

}
// 
function render_pastConsultation(data) {
    // console.log(data);
    let containerClass = 'history_box';
    if (data.preConsAccepted == 0)
        containerClass += ' history_box_error';
    const container = make_E('div', null, {
        class: containerClass
    });
    // 
    let row = make_E('span', data.preConsTitle, {
        class: 'notif_box_title'
    });
    container.appendChild(row);
    // 
    row = make_E('span', data.preConsDateCreation, {
        class: 'notif_box_date'
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
    if (data.preConsAccepted != 0) {
        let btns_cont = make_E('div', null, {
            class: 'notif_box_btns_cont'
        })
        let btn = make_E('a', 'Reviser', {
            href: `/chat/${data.preConsId}`,
            class: 'notif_box_btnAlt'
        });
        btns_cont.appendChild(btn);
        container.appendChild(btns_cont);
    }
    // 
    return container;
}
// 
function render_pastCons_container() {
    const container = make_E('div', null, {
        id: 'pastCons_container'
    });
    return container;
}