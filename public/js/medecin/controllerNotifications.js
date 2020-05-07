$(document).ready(async () => {
    let response = await $.post('/getNotifications', {
        matricule: sessionStorage.getItem('matricule') || null
    }).promise();
    // 
    response = JSON.parse(response);
    generateNotification(response);
});

function generateNotification(array) {
    array.forEach(notification => {
        makeNotificationBox(notification);
    });
}