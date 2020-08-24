function render_onHold() {
    const container = make_E('div', null, {
        id: 'preConsStatus'
    });
    const title = make_E('h4', 'Vous aves une consultation en cours de traitment');
    const btn = make_E('input', null, {
        type: 'button',
        value: 'Anuller',
        id: 'cancelPrecons',
        onclick: `listener_cancelPrecons()`
    });
    // 
    container.appendChild(title);
    container.appendChild(btn);
    return container;
}
// 
function render_preconsForm() {
    const container = make_E('div', null, {
        id: 'preConsForm'
    });
    const table = make_E('table', null, {
        border: "1"
    });
    // 
    let row = make_E('tr');
    let col_key = make_E('td', `Titre :`);
    let col_value = make_E('td');
    let col_input = make_E('input', null, {
        type: 'text',
        class: '',
        id: 'conTitle',
        required: true
    });
    col_value.appendChild(col_input);
    row.appendChild(col_key);
    row.appendChild(col_value);
    table.appendChild(row);
    // 
    row = make_E('tr');
    col_key = make_E('td', `Description :`);
    col_value = make_E('td');
    col_input = make_E('textarea', null, {
        cols: '30',
        rows: '10',
        class: '',
        id: 'conDesc',
        required: true
    });
    col_value.appendChild(col_input);
    row.appendChild(col_key);
    row.appendChild(col_value);
    table.appendChild(row);
    // 
    row = make_E('tr');
    col_key = make_E('td', `Ajouter des documents :`);
    col_value = make_E('td');
    col_input = make_E('input', null, {
        type: 'file',
        multiple: true,
        class: '',
        name: 'conFile',
        id: 'conFile'
    });
    col_value.appendChild(col_input);
    row.appendChild(col_key);
    row.appendChild(col_value);
    table.appendChild(row);
    // 
    row = make_E('tr');
    col_key = make_E('td');
    col_value = make_E('td');
    col_input = make_E('input', null, {
        type: 'button',
        value: 'Envoyer',
        class: '',
        id: 'sendForm',
        onclick: `listener_sendForm()`
    });
    col_value.appendChild(col_input);
    row.appendChild(col_key);
    row.appendChild(col_value);
    table.appendChild(row);
    // 
    container.appendChild(table);
    return container;
}
// 
function render_consultation(data) {
    console.log(data);
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
    return container;
}