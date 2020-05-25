function makeNotificationBox(data) {
    // 🎲
    var container = makeElement('div');
    container.setAttribute('class', 'box-notif space-between-15px notificationBox');
    container.setAttribute('data-notifId', data.index);
    // //
    var cont1 = makeElement('div');
    cont1.setAttribute('class', 'space-between-2_5px vertical');
    var cont2 = makeElement('div');
    cont2.setAttribute('class', 'vertical');
    // 
    var cont3 = makeElement('div');
    cont3.setAttribute('class', 'vertical space-between-5px');
    var cont4 = makeElement('div');
    cont4.setAttribute('class', 'vertical space-between-5px');
    var cont5 = makeElement('div');
    cont5.setAttribute('class', 'horizontal');
    var cont6 = makeElement('div');
    cont6.setAttribute('class', 'vertical space-between-5px');
    // 
    var cont7 = makeElement('div');
    cont7.setAttribute('class', 'horizontal align-right');
    // // //
    //cont 1
    var txt1 = makeElement('span');
    txt1.setAttribute('class', 'box-notif-title');
    txt1.innerText = data.name;
    var txt2 = makeElement('span');
    txt2.setAttribute('class', 'box-notif-date');
    txt2.innerText = getDate(data.date);
    cont1.appendChild(txt1);
    cont1.appendChild(txt2);
    //cont 2
    var txt3 = makeElement('span');
    txt3.setAttribute('class', 'box-notif-matric');
    txt3.innerText = "Matricule :" + data.matricule;
    var txt4 = makeElement('span');
    txt4.setAttribute('class', 'box-notif-age');
    txt4.innerText = "Age :" + data.age;
    var txt5 = makeElement('span');
    txt5.setAttribute('class', 'box-notif-tel');
    txt5.innerText = "Telephone : " + data.numeroTel;
    cont2.appendChild(txt3);
    cont2.appendChild(txt4);
    cont2.appendChild(txt5);
    // cont 7
    var btn2 = makeElement('a');
    btn2.setAttribute('class', 'btn-acc m-top-20');
    btn2.innerText = 'Accepter';
    btn2.onclick = () => {
        acceptNotification(container.getAttribute('data-notifId'));
    }
    // cont7.appendChild(btn1);
    cont7.appendChild(btn2);
    // //
    container.appendChild(cont1);
    container.appendChild(cont2);
    // container.appendChild(cont3);
    // container.appendChild(cont4);
    // container.appendChild(cont5);
    // container.appendChild(cont6);
    container.appendChild(cont7);
    // 
    document.getElementById('topRowElementsContainer').appendChild(container);
}

function generateSemiNotifBox(data) {
    console.log(data);
    // 🎲
    var container = makeElement('div');
    container.setAttribute('class', 'box-notif space-between-15px activeNotificationBox');
    container.setAttribute('data-notifId', data.idPreCons);
    // //
    var cont1 = makeElement('div');
    cont1.setAttribute('class', 'space-between-2_5px vertical');
    var cont2 = makeElement('div');
    cont2.setAttribute('class', 'vertical');
    // 
    var cont7 = makeElement('div');
    cont7.setAttribute('class', 'horizontal align-right');
    // // //
    //cont 1
    var txt1 = makeElement('span');
    txt1.setAttribute('class', 'box-notif-title');
    txt1.innerText = data.nom;
    var txt2 = makeElement('span');
    txt2.setAttribute('class', 'box-notif-date');
    txt2.innerText = getDate(data.DATE_CONSULTATION);
    cont1.appendChild(txt1);
    cont1.appendChild(txt2);
    //cont 2
    var txt3 = makeElement('span');
    txt3.setAttribute('class', 'box-notif-matric');
    txt3.innerText = "Matricule : " + data.MATRICULE_PAT;
    var txt4 = makeElement('span');
    var statusConsultation = "En cours",
        statusClasses = "box-notif-matric notifInProgress";
    if (data.JOUR_REPOS == 1) {
        statusConsultation = "Terminé";
        statusClasses = "box-notif-matric notifDone";
    }
    txt4.setAttribute('class', statusClasses);
    txt4.innerText = "Statut : " + statusConsultation;

    cont2.appendChild(txt3);
    cont2.appendChild(txt4);
    // 

    // 
    // cont 7
    var btn2 = makeElement('a');
    btn2.setAttribute('class', 'btn-acc m-top-20');
    btn2.innerText = 'Contacter';
    if (data.JOUR_REPOS == 1)
        btn2.innerText = "Reviser";
    btn2.setAttribute('href', `/medecin/contact?room=${data.roomId}&patient=${data.MATRICULE_PAT}`);
    // 
    cont7.appendChild(btn2);
    // //
    container.appendChild(cont1);
    container.appendChild(cont2);
    container.appendChild(cont7);
    // 
    document.getElementById('botRowElementsContainer').appendChild(container);
}

function makeElement(type) {
    return document.createElement(type);
}
// 
function getDate(date) {
    date = new Date(date);
    return `Le ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()}`;
    // return date;
}