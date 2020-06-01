function createMsgBox(msg, type) {
    var container = document.createElement('div');
    container.setAttribute('class', `messageContainer ${type}`);
    var txt = document.createElement('span');
    console.log(msg);
    if (msg.type == 'document') {
        txt = document.createElement('a');
        txt.setAttribute('href', `/${msg.filePath}`);
        txt.setAttribute('download', 'true');
        txt.innerHTML = `<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> ${msg.contenu}`;
        txt.setAttribute('class', 'msgTxtLink');
    } else if (msg.type.toLowerCase() == 'text')
        txt.innerText = msg.contenu;
    // 
    container.appendChild(txt);
    document.getElementById('msgsCont').appendChild(container);
}

function createSubmitWindow(data) {
    var params = [{
        text: "Mle :",
        enabled: false
    }, {
        text: "Nom :",
        enabled: false
    }, {
        text: "Prenom :",
        enabled: false
    }, {
        text: "Direction :",
        enabled: false
    }, {
        text: "Nbr de jour du RM :",
        enabled: true
    }, {
        text: "Nbr de jour validée :",
        enabled: true
    }, {
        text: "Visa de medecin :",
        enabled: true
    }, {
        text: "Commentaire :",
        enabled: true
    }];
    return new Promise(function (resolve, reject) {
        var cont = document.createElement('div');
        cont.setAttribute('class', 'submitPopupBg');
        var innerCont = document.createElement('div');
        innerCont.setAttribute('class', 'submitPopup');
        // 
        var title = document.createElement('span');
        title.setAttribute('class', 'submitPopupTitle');
        title.innerText = "Remplir les champs nécessaires :";
        var inputsControlsCont = document.createElement('div');
        inputsControlsCont.setAttribute('class', 'submitPopupBox');
        var btnsCont = document.createElement('div');
        btnsCont.setAttribute('class', 'btnsBox');
        // 
        params.forEach((param, i) => {
            var inputCont = document.createElement('div');
            inputCont.setAttribute('class', 'submitPopupInputCont');
            var inputLabel = document.createElement('span');
            inputLabel.setAttribute('class', 'submitPopupInputLabel');
            inputLabel.innerText = param.text;
            var inputElement;
            if (i != params.length - 1) {
                inputElement = document.createElement('input');
                if (!param.enabled)
                    inputElement.setAttribute('disabled', 'true');
                inputElement.setAttribute('class', 'submitPopupInput');
                // 
                if (i <= 3) {
                    inputElement.value = Object.values(data)[i];
                }
            } else {
                inputElement = document.createElement('textarea');
                inputElement.setAttribute('rows', '10');
                inputElement.setAttribute('class', 'submitPopupInput submitPopupInputComment');
            }
            // 
            inputCont.appendChild(inputLabel);
            inputCont.appendChild(inputElement);
            // 
            inputsControlsCont.appendChild(inputCont);
        });
        // 
        var btnMain = document.createElement('button');
        btnMain.setAttribute('class', 'submitPopupBtn submitPopupBtnMain');
        btnMain.innerText = "Valider";
        btnMain.onclick = function () {
            var insertedValues = document.getElementsByClassName('submitPopupInput');
            resolve({
                state: true,
                data: {
                    nbrJA: insertedValues[4].value,
                    nbrJV: insertedValues[5].value,
                    visaM: insertedValues[6].value,
                    cmnt: insertedValues[7].value
                }
            });
            // 
            cont.remove();
        }
        var btnSec = document.createElement('button');
        btnSec.setAttribute('class', 'submitPopupBtn submitPopupBtnSec');
        btnSec.innerText = "Annuler";
        btnSec.onclick = function () {
            resolve({
                state: false,
                data: {}
            });
            // 
            cont.remove();
        }
        // 
        btnsCont.appendChild(btnMain);
        btnsCont.appendChild(btnSec);
        // 
        // 
        innerCont.appendChild(title);
        innerCont.appendChild(inputsControlsCont);
        innerCont.appendChild(btnsCont);
        // 
        cont.appendChild(innerCont);
        document.getElementById('chatSection').appendChild(cont);
    });
}
// 
function controllPosters(style) {
    document.getElementById('remoteVideoPoster').style.display = style;
    document.getElementById('hostVideoPoster').style.display = style;
}
// 
function switchIconMic(state) {
    document.getElementById('chatMicBtn').children[+(state)].style.display = "block";
    document.getElementById('chatMicBtn').children[+(!(+(state)))].style.display = "none";
}

function switchIconCam(state) {
    document.getElementById('chatCamBtn').children[+(state)].style.display = "block";
    document.getElementById('chatCamBtn').children[+(!(+(state)))].style.display = "none";
} // 
function videoChatIconsControlls() {
    document.getElementById('chatCamBtn').children[0].style.display = "block";
    document.getElementById('chatCamBtn').children[1].style.display = "none";
    document.getElementById('chatMicBtn').children[0].style.display = "block";
    document.getElementById('chatMicBtn').children[1].style.display = "none";
}