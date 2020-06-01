$(document).ready(async () => {
    // UPDATE LINKS
    // document.getElementById('navChatUrl').setAttribute('href', `/medecin/contact?auth=${localStorage.getItem('authToken')}&authId=${localStorage.getItem('authId')}`);
    document.getElementById('navNotifsUrl').setAttribute('href', `/medecin/notifications?auth=${localStorage.getItem('authToken')}&authId=${localStorage.getItem('authId')}`);
    // NOT YET ACCEPTED NOTIFICATIONS BUT ADDDRESSED TO THIS DOCTOR
    let inActiveNotifs = await $.post('/getNotifications', {
        matricule: localStorage.getItem('matricule') || null
    }).promise();
    if (inActiveNotifs != 'platformFail') {
        // 
        inActiveNotifs = JSON.parse(inActiveNotifs);
        generateNotification(inActiveNotifs);
        // THE NOTIFICATIONS THIS DOCTOR ACCEPTED
        let activeNotifs = await $.post('/getMedecinActiveNotifs', {
            matricule: localStorage.getItem('matricule') || null
        }).promise();
        if (activeNotifs != 'platformFail' && activeNotifs != '') {
            // 
            generateActiveNotification(JSON.parse(activeNotifs));
            // 

            // generateNotification(response);
        } else await logServerError();
    } else await logServerError();
});
// 
function generateNotification(array) {
    array.forEach(notification => {
        makeNotificationBox(notification);
    });
}
// 
function generateActiveNotification(activeNotifs) {
    // if (activeNotifs.length > 0)
    // document.getElementById('navChatUrl').setAttribute('href', `/medecin/contact?room=${activeNotifs[0].roomId}&patient=${activeNotifs[0].MATRICULE_PAT}&auth=${localStorage.getItem('authToken')}&authId=${localStorage.getItem('authId')}`);
    let activeNotifications = document.getElementsByClassName('activeNotificationBox');
    activeNotifs.forEach(notif => {
        let exists = false;
        for (let i = 0; i < activeNotifications.length; i++) {
            if (activeNotifications[i].getAttribute('data-notifId') == notif.idPreCons)
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