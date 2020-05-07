function generateNotification(array) {
    array.forEach(notification => {
        makeNotificationBox(notification);
    });
}