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