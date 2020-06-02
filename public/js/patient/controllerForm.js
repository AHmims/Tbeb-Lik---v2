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
    let patientFormData = await $.post('/patientFormBasicData', {
        matricule: localStorage.getItem('matricule') || null
    }).promise();
    if (patientFormData != 'platformFail') {
        patientFormData = JSON.parse(patientFormData);
        // 
        patientFormData.forEach(patientData => {
            document.getElementById('form-patient-nom').value = patientData.nom;
            document.getElementById('form-patient-prenom').value = patientData.prenom;
            document.getElementById('form-patient-matricule').value = patientData.mle;
            let patientDateN = new Date(patientData.dateN);
            document.getElementById('form-patient-dateN').value = `${patientDateN.getDate()}/${patientDateN.getMonth() + 1}/${patientDateN.getFullYear()}`;
        });
    } else await logServerError();
    // 
    // 
    // let response = await $.post('/listeConsultationFields', {}).promise();
    // if (response != 'platformFail') {
    //     response = JSON.parse(response);
    //     console.log('/listeConsultationFields | response => ', response);
    //     response.villes.forEach(element => {
    //         let slctOption = document.createElement('option');
    //         slctOption.setAttribute('value', element.VILLE);
    //         slctOption.innerText = element.VILLE;
    //         // 
    //         document.getElementById('cityOptions').appendChild(slctOption);
    //     });
    //     //
    //     response.proffess.forEach(element => {
    //         let slctOption = document.createElement('option');
    //         slctOption.setAttribute('value', element.ID_SPEC);
    //         slctOption.innerText = element.NOM_SPEC;
    //         // 
    //         document.getElementById('profsOptions').appendChild(slctOption);
    //     });
    // } else await logServerError();
    // 
    document.getElementById('btnEnvoyer').addEventListener('click', async () => {
        // let ville = document.getElementById('cityOptions').options[document.getElementById('cityOptions').selectedIndex].value;
        // let proffes = document.getElementById('profsOptions').options[document.getElementById('profsOptions').selectedIndex].value;
        // 
        let formData = {
            authToken: localStorage.getItem('authToken') || null,
            // ville,
            // proffession,
            date: new Date().toJSON().slice(0, 19).replace('T', ' '),
            motif: document.getElementById('form-patient-motif').value,
            atcd: document.getElementById('form-patient-atcds').value,
            nbja: document.getElementById('form-patient-nombre_jrs').value
        }
        sendNotification(formData);
    });
    // 
    // CHECK IF THE PATIENT HAVE ANY ONGOING NOTIFICATIONS
    // IF YES ADD A BTN FOR HIM TO GO TO THE CONTACT PAGE
    // let exists = await $.post('/getAccessNotif', {
    //     matricule: localStorage.getItem('matricule') || null
    // }).promise();
    // if (exists != 'platformFail') {
    //     // exists = Boolean(exists);
    //     console.log('/getAccessNotif | exists => ', exists);
    //     if (exists != 'false') {
    //         addNotification();
    //         // waiting();
    //     }
    // } else await logServerError();
    // 
    let patientNotifs = await $.post('/getNotifsByPatient', {
        matricule: localStorage.getItem('matricule') || null
    }).promise();
    if (patientNotifs != 'platformFail') {
        patientNotifs = JSON.parse(patientNotifs);
        patientNotifs.forEach(notif => {
            addNotification(notif.dc, notif.jr > -1 ? true : false, notif.nid);
        });
    } else await logServerError();
    // 
    // 
    let notAcceptedRequests = await $.post('/getNotYetAcceptedRequest', {
        matricule: localStorage.getItem('matricule') || null
    }).promise();
    if (notAcceptedRequests != 'platformFail') {
        // 
        if (notAcceptedRequests != 'false') {
            waiting();
        }
    } else await logServerError();
});
// 
var notifState = false,
    notifStyle = ["flex", "none"];
document.getElementById('btnNotif').addEventListener('click', (e) => {
    if (document.getElementById('notifsContainer').style.display == "flex")
        notifState = true;
    if (e.target == document.getElementById('btnNotif').children[0])
        document.getElementById('notifsContainer').style.display = notifStyle[+notifState];
    notifState = !notifState;
    if (notifState)
        updateCounter();
});

function instaShowNotifs() {
    document.getElementById('notifsContainer').style.display = notifStyle[+notifState];
    notifState = !notifState;
    if (notifState)
        updateCounter();
}
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
// function addNotification() {
// MAYBE SOME SALT AND FLAVORS HERE
// document.body.appendChild(createNotification());
// addNotification();
// }
// 
function showForm(element) {
    element.parentElement.remove();
    document.getElementById('form_patient').style.display = "block";
}