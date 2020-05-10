const __GLOBAL_SOCKET = io();
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('Socket Connected ! userId => ', localStorage.getItem('matricule') || null);
    __GLOBAL_SOCKET.emit('newUser', localStorage.getItem('matricule'));
});
__GLOBAL_SOCKET.on('queryResult', data => {
    switch (data.status) {
        case 0:
            alert(`Aucune medecin disponible à ete trouver !`);
            break;
        case 1:
            alert('Vous avez deja un demande en cours');
            break;
        case 2:
            waiting();
            alert(`demande envoyer à ${data.data} Medecin(s)`);
            break;
        default:
            console.warn(`Unknown status code !`);
    }
});
__GLOBAL_SOCKET.on('notificationAccepted', () => {
    // addNotification();
    window.location.assign('/patient/contact');
});
// 
__GLOBAL_SOCKET.on('cancelRequestSuccess', () => {
    if (document.getElementById('waitingConsultation')) {
        document.getElementById('waitingConsultation').remove();
    }
});
// FUNCTIONS
//#region 
function sendNotification(ville, proffession) {
    __GLOBAL_SOCKET.emit('sendNotif', {
        ville,
        proffession
    });
    // 
}

function canceRequest() {
    __GLOBAL_SOCKET.emit('cancelRequest', localStorage.getItem('matricule') || null);
}
//#endregion