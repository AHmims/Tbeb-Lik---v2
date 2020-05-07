$(document).ready(async () => {
    let response = await $.post('/getNotifications', {
        matricule: sessionStorage.getItem('matricule')
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