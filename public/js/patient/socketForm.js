const __GLOBAL_SOCKET = io();
// 
__GLOBAL_SOCKET.on('connect', () => {
    console.log('Socket Connected ! userId => ', sessionStorage.getItem('matricule'));
    __GLOBAL_SOCKET.emit('newUser', sessionStorage.getItem('matricule'));
});
__GLOBAL_SOCKET.on('queryResult', data => {
    if (data != null) {
        alert(`Demende envoyer à ${data} Medecin(s)`);
    } else
        alert(`Aucune medecin disponible à ete trouver !`);
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