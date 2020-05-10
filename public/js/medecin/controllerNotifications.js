$(document).ready(async () => {
    // NOT YET ACCEPTED NOTIFICATIONS BUT ADDDRESSED TO THIS DOCTOR
    let inActiveNotifs = await $.post('/getNotifications', {
        matricule: localStorage.getItem('matricule') || null
    }).promise();
    // 
    inActiveNotifs = JSON.parse(inActiveNotifs);
    generateNotification(inActiveNotifs);
    // THE NOTIFICATIONS THIS DOCTOR ACCEPTED
    let activeNotifs = await $.post('/getMedecinActiveNotifs', {
        matricule: localStorage.getItem('matricule') || null
    }).promise();
    // 
    generateActiveNotification(JSON.parse(activeNotifs));
    // 

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
    document.getElementById('navChatUrl').setAttribute('href', `/medecin/contact?room=${activeNotifs[0].ID_ROOM}&patient=${activeNotifs[0].MATRICULE_PAT}`);
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
// 