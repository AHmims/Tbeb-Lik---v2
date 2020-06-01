const __GLOBAL_SOCKET = io();
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('Socket Connected ! userId => ', localStorage.getItem('authToken') || null);
    __GLOBAL_SOCKET.emit('newUser', localStorage.getItem('authToken'));
});
__GLOBAL_SOCKET.on('platformFail', async () => {
    // console.log('some error in code | refresh page');
    await logServerError();
});
__GLOBAL_SOCKET.on('queryResult', async data => {
    switch (data.status) {
        case 0:
            logError(`Aucune medecin disponible à ete trouver !`);
            // alert(``);
            break;
        case 1:
            logError('Vous avez deja une demande en cours');
            break;
        case 2:
            logSuccess(`Demande envoyer à ${data.data} Medecin(s)`);
            waiting();
            break;
        default:
            logError(`Unknown status code !`);
    }
});
__GLOBAL_SOCKET.on('notificationAccepted', (date, nId) => {
    addNotification(date, false, nId);
    if (document.getElementById('waitingConsultation'))
        document.getElementById('waitingConsultation').remove();
    // window.location.assign('/patient/contact');
});
// 
__GLOBAL_SOCKET.on('cancelRequestSuccess', () => {
    if (document.getElementById('waitingConsultation')) {
        document.getElementById('waitingConsultation').remove();
    }
});
// FUNCTIONS
//#region 
function sendNotification(formData) {
    // THIS SEND TOKEN IN THE DATA
    __GLOBAL_SOCKET.emit('sendNotif', formData);
    // 
}

function canceRequest() {
    __GLOBAL_SOCKET.emit('cancelRequest', localStorage.getItem('authToken') || null);
}
//#endregion