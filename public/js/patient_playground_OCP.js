var state = false,
    style = ["flex", "none"];
document.getElementById('btnNotif').addEventListener('click', (e) => {
    if (e.target == document.getElementById('btnNotif').children[0])
        document.getElementById('notifsContainer').style.display = style[+state];
    state = !state;
    if (state)
        updateCounter();
});
// 
// 
var notifs = document.getElementsByClassName('notification');
var notifsClose = document.getElementsByClassName('notifClose');
for (let i = 0; i < notifsClose.length; i++) {
    notifsClose[i].addEventListener('click', () => {
        notifs[i].setAttribute('class', 'notification notif-inactive');
        updateCounter();
    });
}
// 
function updateCounter() {
    var count = 0;
    var notifs = document.getElementsByClassName('notification');
    for (let i = 0; i < notifs.length; i++) {
        if (notifs[i].classList.length == 1)
            count++;
    }
    // 
    document.getElementById('notificationsCounter').innerText = count;
}