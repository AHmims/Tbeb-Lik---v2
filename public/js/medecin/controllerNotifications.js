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
    generateActiveNotification(JSON.parse(activeNotifs));
    // generateNotification(response);
});
// 
function generateNotification(array) {
    array.forEach(notification => {
        makeNotificationBox(notification);
    });
}
// 
function generateActiveNotification(activeNotifs) {
    let activeNotifications = document.getElementsByClassName('activeNotificationBox');
    activeNotifs.forEach(notif => {
        let exists = false;
        for (let i = 0; i < activeNotifications.length; i++) {
            if (activeNotifications[i].getAttribute('data-notifId') == notif.ID_PRECONS)
                exists = true;
        }
        if (!exists)
            generateSemiNotifBox(notif);
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