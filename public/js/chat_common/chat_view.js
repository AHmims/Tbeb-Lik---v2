function renderMessage(msgData, incoming, error = false) {
    const row = make_E('div', null, {
        id: `msg_${msgData.msgId}`,
        class: `msg_row ${error ? 'msgError' : ''} ${incoming ? 'msg_row_remote' : 'msg_row_host'}`
    });
    // 
    const txtElem = make_E(msgData.msgType == 'text' ? 'span' : 'a', msgData.msgContent, msgData.msgType != 'text' ? {
        href: `/${msgData.msgFilePath}`,
        class: 'msg_content msg_content_link'
    } : {
        class: 'msg_content msg_content_text'
    });
    // 
    row.appendChild(txtElem);
    // 
    return row;
}