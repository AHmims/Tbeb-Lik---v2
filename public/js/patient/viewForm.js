function createNotification() {
    let cont = document.createElement('h5');
    cont.style.textAlign = "center";
    cont.innerHTML = "Un medecin à accepeter votre demande<br/><a href='/patient/contact'>Click ici pour commencer</a>";
    // 
    return cont;
}
// 
function addNotification() {
    // console.log(state);
    let cont = document.createElement('div');
    cont.setAttribute('id', nId);
    let contClass = 'notification';
    if (!state != true)
        contClass += ' notif-inactive';
    cont.setAttribute('class', contClass);
    // 
    let iconbox = document.createElement('div');
    let icon = document.createElement('img');
    iconbox.setAttribute('class', 'iconBox');
    icon.setAttribute('src', '../icon/Calendar3.svg');
    iconbox.appendChild(icon);
    // 
    let txtCont = document.createElement('div');
    txtCont.setAttribute('class', 'notifText');
    let txtTitle = document.createElement('span');
    txtTitle.setAttribute('class', 'notifTitle');
    txtTitle.innerText = "Votre demande à été accepte";
    let txtDesc = document.createElement('span');
    txtDesc.setAttribute('class', 'notifiDesc');
    txtDesc.innerText = "Click ici pour commencer";
    // 
    txtCont.appendChild(txtTitle);
    txtCont.appendChild(txtDesc);
    // 
    cont.appendChild(iconbox);
    cont.appendChild(txtCont);
    // 
    cont.addEventListener('click', () => {
        window.location.assign('/patient/contact');
    });
    // 
    document.getElementById('notifBoxBody').appendChild(cont);
    // 
    if (!state)
        document.getElementById('btnNotif').setAttribute('class', 'notifActive');
}