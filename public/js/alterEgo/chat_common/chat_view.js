function renderMessage(msgData, incoming, error = false) {
    const row = make_E('tr', null, {
        id: msgData.msgId ? msgData.msgId : '',
        class: error ? 'msgError' : ''
    });
    const received_MSG = make_E('td', incoming ? msgData.msgContent : '', {
        colspan: incoming ? '2' : '1'
    });
    const sent_MSG = make_E('td', !incoming ? msgData.msgContent : '', {
        colspan: !incoming ? '2' : '1'
    });
    // 
    row.appendChild(received_MSG);
    row.appendChild(sent_MSG);
    // 
    return row;
}