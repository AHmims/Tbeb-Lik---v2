var state = false,
    style = ["flex", "none"];
document.getElementById('btnNotif').addEventListener('click', (e) => {
    if (e.target == document.getElementById('btnNotif').children[0])
        document.getElementById('notifsContainer').style.display = style[+state];
    state = !state;
    if (state)
        updateCounter();
});
// 
// 
var notifs = document.getElementsByClassName('notification');
var notifsClose = document.getElementsByClassName('notifClose');
for (let i = 0; i < notifsClose.length; i++) {
    notifsClose[i].addEventListener('click', () => {
        notifs[i].setAttribute('class', 'notification notif-inactive');
        updateCounter();
    });
}
// 
function updateCounter() {
    var count = 0;
    var notifs = document.getElementsByClassName('notification');
    for (let i = 0; i < notifs.length; i++) {
        if (notifs[i].classList.length == 1)
            count++;
    }
    // 
    document.getElementById('notificationsCounter').innerText = count;
}
// 
function addNotification(date, state, nId) {
    // console.log(state);
    let cont = document.createElement('div');
    cont.setAttribute('id', nId);
    let contClass = 'notification';
    if (!state != true)
        contClass += ' notif-inactive';
    cont.setAttribute('class', contClass);
    // 
    let iconbox = document.createElement('div');
    let icon = document.createElement('img');
    iconbox.setAttribute('class', 'iconBox');
    icon.setAttribute('src', '../icon/Calendar3.svg');
    iconbox.appendChild(icon);
    // 
    let txtCont = document.createElement('div');
    txtCont.setAttribute('class', 'notifText');
    let txtTitle = document.createElement('span');
    txtTitle.setAttribute('class', 'notifTitle');
    txtTitle.innerText = "Votre demande à été accepte";
    let txtDesc = document.createElement('span');
    txtDesc.setAttribute('class', 'notifiDesc');
    txtDesc.innerText = "Une réunion était prévue pour le ";
    let txtDescDate = document.createElement('span');
    txtDescDate.setAttribute('class', 'notifDate');
    date = new Date(date);
    txtDescDate.innerText = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()}`;
    // 
    txtDesc.appendChild(txtDescDate);
    // 
    txtCont.appendChild(txtTitle);
    txtCont.appendChild(txtDesc);
    // 
    cont.appendChild(iconbox);
    cont.appendChild(txtCont);
    // 
    cont.addEventListener('click', () => {
        if (!state) {
            $.post('/linkWithMedecin', {
                notif: nId
            }, (response) => {
                if (response == 'true')
                    window.location.assign('/patient/contact');
                else if (response == 'false')
                    alert('Trop tot pour rejoindre');
            });
        }
    });
    // 
    document.getElementById('notifBoxBody').appendChild(cont);
    // 
    if (!state)
        document.getElementById('btnNotif').setAttribute('class', 'notifActive');
}
// 
document.getElementById('btnEnvoyer').addEventListener('click', () => {
    sendNotification({
        motif: document.getElementById('motif').value,
        atcd: document.getElementById('ATCDS').value,
        nbJourA: document.getElementById('nombre_jrs').value
    });
});
// 
$.post('/getPatientNotifications', {
    matricule: sessionStorage.getItem('user_M')
}, (response) => {
    console.log(JSON.parse(response));
    response = JSON.parse(response);
    response.forEach(notif => {
        addNotification(notif.DATE_CONSULTATION, notif.JOUR_REPOS > -1, notif.idPreCons);
    });
});