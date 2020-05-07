const __GLOBAL_SOCKET = io();
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('Socket Connected ! userId => ', sessionStorage.getItem('matricule'));
    __GLOBAL_SOCKET.emit('newUser', sessionStorage.getItem('matricule'));
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
            alert(`Demende envoyer à ${data.data} Medecin(s)`);
            break;
        default:
            console.warn(`Unknown status code !`);
    }
});
// FUNCTIONS
//#region 
function sendNotification(ville, proffession) {
    __GLOBAL_SOCKET.emit('sendNotif', {
        ville,
        proffession
    });
}
//#endregion