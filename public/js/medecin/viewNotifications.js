function makeNotificationBox(data) {
    let table = document.createElement('table');
    table.setAttribute('border', 1);
    Object.keys(data).forEach(key => {
        let row = document.createElement('tr');
        let colKey = document.createElement('td');
        colKey.innerText = key;
        let colValue = document.createElement('td');
        colValue.innerText = data[key];
        // 
        row.appendChild(colKey);
        row.appendChild(colValue);
        // 
        table.appendChild(row);
    });
    let btnRow = document.createElement('tr'),
        btnCol = document.createElement('td'),
        btn = document.createElement('button');
    btnCol.setAttribute('colspan', 2);
    btnCol.style.textAlign = "right";
    // 
    btn.innerText = "Accepter";
    btn.setAttribute('data-notifId', data.index);
    btn.onclick = () => {
        console.log('clicked => ', btn.getAttribute('data-notifId'));
        acceptNotification(btn.getAttribute('data-notifId'));
    }
    btnCol.appendChild(btn);
    btnRow.appendChild(btnCol);
    table.appendChild(btnRow);
    // 
    document.getElementById('notificationsContainer').appendChild(table);
}