$(document).ready(async () => {
    var notifs = document.getElementsByClassName('notification');
    var notifsClose = document.getElementsByClassName('notifClose');
    for (let i = 0; i < notifsClose.length; i++) {
        notifsClose[i].addEventListener('click', () => {
            notifs[i].setAttribute('class', 'notification notif-inactive');
            updateCounter();
        });
    }
    // 
    // 
    // 
    let response = await $.post('/listeConsultationFields', {}).promise();
    response = JSON.parse(response);
    console.log('/listeConsultationFields | response => ', response);
    response.villes.forEach(element => {
        let slctOption = document.createElement('option');
        slctOption.setAttribute('value', element.VILLE);
        slctOption.innerText = element.VILLE;
        // 
        document.getElementById('cityOptions').appendChild(slctOption);
    });
    //
    response.proffess.forEach(element => {
        let slctOption = document.createElement('option');
        slctOption.setAttribute('value', element.ID_SPEC);
        slctOption.innerText = element.NOM_SPEC;
        // 
        document.getElementById('profsOptions').appendChild(slctOption);
    });
    // 
    document.getElementById('btnEnvoyer').addEventListener('click', async () => {
        let ville = document.getElementById('cityOptions').options[document.getElementById('cityOptions').selectedIndex].value;
        let proffes = document.getElementById('profsOptions').options[document.getElementById('profsOptions').selectedIndex].value;
        // 
        sendNotification(ville, proffes);
    });
    // 
    // CHECK IF THE PATIENT HAVE ANY ONGOING NOTIFICATIONS
    // IF YES ADD A BTN FOR HIM TO GO TO THE CONTACT PAGE
    let exists = await $.post('/getAccessNotif', {
        matricule: sessionStorage.getItem('matricule') || null
    }).promise();
    // exists = Boolean(exists);
    console.log('/getAccessNotif | exists => ', exists);
    if (exists != 'false') {
        addNotification();
        // waiting();
    }
    // 
    // 
    let notAcceptedRequests = await $.post('/getNotYetAcceptedRequest', {
        matricule: sessionStorage.getItem('matricule') || null
    }).promise();
    // 
    if (notAcceptedRequests != 'false') {
        waiting();
    }


});
// 
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
// 
function addNotification() {
    // MAYBE SOME SALT AND FLAVORS HERE
    // document.body.appendChild(createNotification());
    addNotification();
}
// 