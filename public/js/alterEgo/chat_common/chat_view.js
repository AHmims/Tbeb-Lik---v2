function renderMessage(msgData, incoming, error = false) {
    const row = make_E('tr', null, {
        id: msgData.msgId ? msgData.msgId : '',
        class: error ? 'msgError' : ''
    });
    // 
    const txtElem = make_E(msgData.msgType == 'text' ? 'span' : 'a', msgData.msgContent, msgData.msgType != 'text' ? {
        href: `/${msgData.msgFilePath}`
    } : {});
    // 
    const received_MSG = make_E('td', null, {
        colspan: incoming ? '2' : '1'
    });
    const sent_MSG = make_E('td', null, {
        colspan: !incoming ? '2' : '1'
    });
    // 
    if (incoming)
        received_MSG.appendChild(txtElem);
    else
        sent_MSG.appendChild(txtElem);
    // 
    // 
    row.appendChild(received_MSG);
    row.appendChild(sent_MSG);
    // 
    return row;
}