window.onload = () => {
    if (dgid('navBar')) {
        var navBar = dgid('navBar');
        navBar.appendChild(makeLogo());
        navBar.appendChild(makeNavigation(navBar.classList[0]));
        navBar.appendChild(makeExit());
    }
    if (dgclass('btn-doc').length > 0) {
        var btns = dgclass('btn-doc');
        for (let i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', () => {
                makeOrdonanceForm("dd", "ddd");
            });
            // 
            var str = btns[i].innerText;
            btns[i].innerHTML = "";
            // 
            btns[i].innerHTML = `<img src="../icon/doc.svg"/> ${str}`;
        }
    }
    if (dgclass('btn-acc').length > 0) {
        var btns = dgclass('btn-acc');
        for (let i = 0; i < btns.length; i++) {
            var str = btns[i].innerText;
            btns[i].innerHTML = "";
            // 
            btns[i].innerHTML = `<img src="../icon/check.svg"/> ${str}`;
        }
    }
    if (dgclass('btn-no').length > 0) {
        var btns = dgclass('btn-no');
        for (let i = 0; i < btns.length; i++) {
            var str = btns[i].innerText;
            btns[i].innerHTML = "";
            // 
            btns[i].innerHTML = `<img src="../icon/cross.svg"/> ${str}`;
        }
    }
    if (dgclass('btn-download').length > 0) {
        var btns = dgclass('btn-download');
        for (let i = 0; i < btns.length; i++) {
            var str = btns[i].innerText;
            btns[i].innerHTML = "";
            // 
            btns[i].innerHTML = `${str} <img src="../icon/download.svg"/>`;
        }
    }
    if (dgclass('btn-send').length > 0) {
        var btns = dgclass('btn-send');
        for (let i = 0; i < btns.length; i++) {
            var str = btns[i].innerText;
            btns[i].innerHTML = "";
            // 
            btns[i].innerHTML = `${str} <img src="../icon/send1.svg"/>`;
        }
    }
    if (dgclass('box-rndv-date').length > 0) {
        var txt = dgclass('box-rndv-date');
        for (let i = 0; i < txt.length; i++) {
            var string = txt[i].innerText;
            txt[i].innerHTML = `<img src="../icon/calendar2.svg" class="box-rndv-date-icon"> <span>${string}</span>`;
        }
    }
    if (dgclass('box-rndv-note').length > 0) {
        var txt = dgclass('box-rndv-note');
        for (let i = 0; i < txt.length; i++) {
            var string = txt[i].innerText;
            txt[i].innerHTML = `<img src="../icon/pen.svg" class="box-rndv-note-icon"> <span>${string}</span>`;
        }
    }
    if (dgclass('patientRow').length > 0) {
        var rows = dgclass('patientRow');
        for (let i = 0; i < rows.length; i++) {
            var icon = document.createElement('img');
            icon.setAttribute('src', '../icon/dots.svg');
            icon.setAttribute('class', 'align-right');
            rows[i].appendChild(icon);
            // 
            rows[i].addEventListener('click', () => {
                for (let j = 0; j < rows.length; j++) {
                    if (i != j)
                        rows[j].setAttribute('class', 'patientRow');
                    else
                        rows[j].setAttribute('class', 'patientRow patientRow-active');
                }
            });
            // 
        }
    }
    if (dgclass('patientInfos-ordo-info').length > 0) {
        var cont = dgclass('patientInfos-ordo-info');
        for (let i = 0; i < cont.length; i++) {
            var icon = document.createElement('img');
            icon.setAttribute('class', 'patientInfos-ordo-info-icon');
            icon.setAttribute('src', '../icon/hint.svg');
            // 
            cont[i].appendChild(icon);
        }
    }
    if (dgclass('bottomTable').length > 0) {
        var bottom = dgclass('bottomTable');
        for (var i = 0; i < bottom.length; i++) {
            var input = document.createElement('input');
            var iconSend = document.createElement('img');
            // 
            input.setAttribute('type', "text");
            input.setAttribute('class', 'bottomTable-msgInput');
            input.setAttribute('id', bottom[i].getAttribute('data-idInput'));
            input.setAttribute('placeholder', "Votre message text...");
            iconSend.setAttribute('src', '../icon/send2.svg');
            iconSend.setAttribute('class', 'bottomTable-msgSend');
            iconSend.setAttribute('id', bottom[i].getAttribute('data-idSend'));
            // 
            bottom[i].appendChild(input);
            bottom[i].appendChild(iconSend);
        }
    }
    // 
    // 
    flatpickr('.box-rndv-date-input', {
        "disable": [
            (date) => {
                return (date.getDay() === 0 || date.getDay() === 6);
            }
        ],
        "locale": {
            "firstDayOfWeek": 1
        }
    });
    // 
    // console.log('%c ', 'font-size:400px; background:url(https://pics.me.me/codeit-google-until-youfinda-stackoverflow-answerwith-code-to-copy-paste-34126823.png) no-repeat;');
}
// 
function dgid(id) {
    return document.getElementById(id);
}
// 
function dgclass(value) {
    return document.getElementsByClassName(value);
}
// 
function makeLogo() {
    var link = document.createElement('a');
    link.setAttribute('href', '#');
    var logo = document.createElement('img');
    logo.setAttribute('src', '../img/logo.svg');
    // 
    link.appendChild(logo);
    return link;
}
// 
function makeExit() {
    var link = document.createElement('a');
    link.setAttribute('href', '#');
    var icon = document.createElement('img');
    icon.setAttribute('src', '../icon/exit.svg');
    // 
    link.appendChild(icon);
    return link;
}
// 
function makeNavigation(mode) {
    var icons = [];
    var container = document.createElement('div');
    container.setAttribute('class', 'navCont');
    switch (mode) {
        case 'medecin':
            icons = ["bell", "chat", "note"];
            break;
        case 'patient':
            icons = ["bell", "chat"];
            break;
        case 'pharmacie':
            icons = ["note", "calendar", "chat"];
            break;
        case 'admin':
            icons = ["medecin", "pharmacie"];
            break;
    }
    // 
    for (var i = 0; i < icons.length; i++) {
        var link = document.createElement('a');
        link.setAttribute('href', '#');
        var box = document.createElement('div');
        box.setAttribute('class', "navIconBox");
        var icon = document.createElement('img');
        icon.setAttribute('src', `../icon/${icons[i]}.svg`);
        // 
        box.appendChild(icon);
        link.appendChild(box)
        container.appendChild(link);
    }

    return container;
}
// 
function makeOrdonanceForm(idValue, classValue) {
    var _DATE = "01/01/1010",
        _PATIENT = "Ali Hmims",
        _DOCTOR = "Sanaa Saadoune";
    // 
    var formBg = document.createElement('div');
    formBg.setAttribute('class', 'ordoBoxBg');
    formBg.addEventListener('click', (e) => {
        if (e.target == formBg)
            formBg.remove();
    });
    var form = document.createElement('div');
    form.setAttribute('class', 'ordoBox');
    // 
    var formRow = document.createElement('div');
    formRow.setAttribute('class', 'font-f-Gilroy vertical margin-b-26');
    // 
    var formTitle = document.createElement('span');
    formTitle.innerText = "Ordonnance";
    formTitle.setAttribute('class', 'font-s-38 txt-c-D font-w-b');
    var formDate = document.createElement('span');
    formDate.innerText = `Le : ${_DATE}`;
    formDate.setAttribute('class', 'font-s-20 txt-c-FD font-w-n align-right');
    var formDesti = document.createElement('span');
    formDesti.innerText = `Pour : ${_PATIENT}`;
    formDesti.setAttribute('class', 'font-s-24 txt-c-D font-w-m');
    // 
    var formsubRow = document.createElement('div');
    formsubRow.setAttribute('class', 'horizontal width-100');
    formsubRow.appendChild(formDesti);
    formsubRow.appendChild(formDate);
    // 
    formRow.appendChild(formTitle);
    formRow.appendChild(formsubRow);
    // 
    //
    //  
    var inputsCont = document.createElement('div');
    inputsCont.setAttribute('class', 'ordoInputsCont');
    var inputformRow = document.createElement('div');
    inputformRow.setAttribute('class', 'margin-b-10');
    var medicamInput = document.createElement('input');
    medicamInput.setAttribute('placeholder', 'Médicament 1');
    medicamInput.setAttribute('class', 'ordoMedicamInput');
    var dosageInput = document.createElement('input');
    dosageInput.setAttribute('placeholder', 'Dosage');
    dosageInput.setAttribute('class', 'ordoDosageInput');
    // 
    inputformRow.appendChild(medicamInput);
    inputformRow.appendChild(dosageInput);
    // 
    var addBtn = document.createElement('button');
    addBtn.setAttribute('class', 'ordoAddMedi');
    var txtBtn = document.createElement('span');
    txtBtn.appendChild(document.createTextNode('Ajouter médicament'));
    var iconBtn = document.createElement('img');
    iconBtn.setAttribute('src', '../icon/plus.svg');
    // 
    addBtn.appendChild(iconBtn);
    addBtn.appendChild(txtBtn);
    // 
    // 
    inputsCont.appendChild(inputformRow);
    inputsCont.appendChild(addBtn);






    form.appendChild(formRow);
    form.appendChild(inputsCont);
    formBg.appendChild(form);
    // 
    // 
    document.getElementById('container').appendChild(formBg);

}