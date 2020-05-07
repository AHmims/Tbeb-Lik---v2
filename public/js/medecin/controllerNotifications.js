$(document).ready(async () => {
    // NOT YET ACCEPTED NOTIFICATIONS BUT ADDDRESSED TO THIS DOCTOR
    let inActiveNotifs = await $.post('/getNotifications', {
        matricule: sessionStorage.getItem('matricule') || null
    }).promise();
    // 
    inActiveNotifs = JSON.parse(inActiveNotifs);
    generateNotification(inActiveNotifs);
    // THE NOTIFICATIONS THIS DOCTOR ACCEPTED
    let activeNotifs = await $.post('/getMedecinActiveNotifs', {
        matricule: sessionStorage.getItem('matricule') || null
    }).promise();
    // 
    activeNotifs = JSON.parse(activeNotifs);
    activeNotifs.forEach(notif => {
        generateSemiNotifBox(notif);
    });
    // generateNotification(response);
});
// 
function generateNotification(array) {
    array.forEach(notification => {
        makeNotificationBox(notification);
    });
}
// 
function removeNotification(notifId) {
    let notification = Array.from(document.getElementsByClassName('notificationBox')).filter(notif => {
        return notif.getAttribute('data-notifId') == notifId;
    });
    // 
    console.log('removeNotification() notification => ', notification);
    if (notification[0])
        notification[0].remove();
}