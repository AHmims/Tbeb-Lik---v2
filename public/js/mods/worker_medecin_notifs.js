document.getElementsByClassName('navIconBox')[0].parentElement.setAttribute('href', '/medecin/notifications');
document.getElementsByClassName('navIconBox')[1].parentElement.setAttribute('href', '/medecin/contact');
document.getElementsByClassName('navIconBox')[0].setAttribute('class', 'navIconBox notifSelected');
// 
// 
function notifMiddleMan(data) {
    data.forEach(element => {
        creationCardConsultation(element, element.index);
    });
}
// 
$.post('/getNotifications', {}, (response) => {
    notifMiddleMan(JSON.parse(response));
});
// 
function hideSelectedNotifBox(nId) {
    let boxes = document.getElementsByClassName('box-notif');
    Array.from(boxes).forEach(box => {
        if (box.getAttribute('id') == nId) {
            console.log('in');
            box.remove();
        }
    });
}