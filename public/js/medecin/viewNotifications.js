// var data = {
//     name: "",
//     date: "",
//     matricule: "",
//     age: "",
//     numeroTel: "",
//     motif: "",
//     atcds: "",
//     nbJourApporte: "",
//     files: ["nomfichier.ext", "nomfichier.ext"]
// }
function makeNotificationBox(data) {
    let table = document.createElement('table');
    table.setAttribute('border', 1);
    table.setAttribute('class', 'notificationBox');
    table.setAttribute('data-notifId', data.index);
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
    btn.onclick = () => {
        console.log('clicked => ', table.getAttribute('data-notifId'));
        acceptNotification(table.getAttribute('data-notifId'));
    }
    btnCol.appendChild(btn);
    btnRow.appendChild(btnCol);
    table.appendChild(btnRow);
    // 
    document.getElementById('notificationsContainer').appendChild(table);
}
//
// var data = {
//     ID_PRECONS : "",
//     nom: "",
//     DATE_CREATION: "",
//     DATE_CONSULTATION: "",
//     JOUR_REPOS: "",
//     MATRICULE_PAT : "",
//     ID_ROOM : ""
// } 
function generateSemiNotifBox(data) {
    let table = document.createElement('table');
    table.setAttribute('border', 1);
    table.setAttribute('class', 'activeNotificationBox');
    table.setAttribute('data-notifId', data.ID_PRECONS);
    // table.setAttribute('data-patientId', data.MATRICULE_PAT);
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
        btn = document.createElement('a');
    btnCol.setAttribute('colspan', 2);
    btnCol.style.textAlign = "right";
    // 
    btn.innerText = "Contacter";
    btn.setAttribute('href', `/medecin/contact?room=${data.ID_ROOM}&patient=${data.MATRICULE_PAT}`);
    btnCol.appendChild(btn);
    btnRow.appendChild(btnCol);
    table.appendChild(btnRow);

    // 
    document.getElementById('activeNotifications').appendChild(table);
}