var data = {
    name: "dkqsdjl",
    date: "qslkdjlqsk",
    matricule: "qsldkmlsq",
    age: "qs",
    numeroTel: "4203948",
    motif: "qsdmqskmldqksmldkqsldmqslkdmlqksdmlqksmdlkqsml",
    atcds: "qsdmkqskdjqslkdjlqksjdlkqjldkjqslkd",
    nbJourApporte: "99",
    files: ["nomfichier.ext", "nomfichier.ext"]
}
creationCardConsultation(data);

function creationCardConsultation(data) {
    // 🎲
    var container = makeElement('div');
    container.setAttribute('class', 'box-notif space-between-15px');
    // //
    var cont1 = makeElement('div');
    cont1.setAttribute('class', 'space-between-2_5px vertical');
    var cont2 = makeElement('div');
    cont2.setAttribute('class', 'vertical');
    var cont3 = makeElement('div');
    cont3.setAttribute('class', 'vertical space-between-5px');
    var cont4 = makeElement('div');
    cont4.setAttribute('class', 'vertical space-between-5px');
    var cont5 = makeElement('div');
    cont5.setAttribute('class', 'horizontal');
    var cont6 = makeElement('div');
    cont6.setAttribute('class', 'vertical space-between-5px');
    var cont7 = makeElement('div');
    cont7.setAttribute('class', 'horizontal m-top-15 align-right');
    // // //
    //cont 1
    var txt1 = makeElement('span');
    txt1.setAttribute('class', 'box-notif-title');
    txt1.innerText = data.name;
    var txt2 = makeElement('span');
    txt2.setAttribute('class', 'box-notif-date');
    txt2.innerText = data.date;
    cont1.appendChild(txt1);
    cont1.appendChild(txt2);
    //cont 2
    var txt3 = makeElement('span');
    txt3.setAttribute('class', 'box-notif-matric');
    txt3.innerText = data.matricule;
    var txt4 = makeElement('span');
    txt4.setAttribute('class', 'box-notif-age');
    txt4.innerText = data.age;
    var txt5 = makeElement('span');
    txt5.setAttribute('class', 'box-notif-tel');
    txt5.innerText = data.numeroTel;
    cont2.appendChild(txt3);
    cont2.appendChild(txt4);
    cont2.appendChild(txt5);
    //cont 3
    var txt6 = makeElement('span');
    txt6.setAttribute('class', 'box-notif-subTitle');
    txt6.innerText = 'Motif';
    var txt7 = makeElement('div');
    txt7.setAttribute('class', 'box-notif-desc');
    txt7.innerText = data.motif;
    cont3.appendChild(txt6);
    cont3.appendChild(txt7);
    //cont 4
    var txt8 = makeElement('span');
    txt8.setAttribute('class', 'box-notif-subTitle');
    txt8.innerText = 'ATCDs';
    var txt9 = makeElement('div');
    txt9.setAttribute('class', 'box-notif-desc');
    txt9.innerText = data.atcds;
    cont4.appendChild(txt8);
    cont4.appendChild(txt9);
    // cont 5
    var txt10 = makeElement('span');
    txt10.setAttribute('class', 'box-notif-subTitle');
    txt10.innerText = 'Nombre de jour apporté :';
    var txt11 = makeElement('span');
    txt11.setAttribute('class', 'box-notif-pj');
    txt11.innerText = data.nbJourApporte;
    cont5.appendChild(txt10);
    cont5.appendChild(txt11);
    //cont 6
    var txt12 = makeElement('span');
    txt12.setAttribute('class', 'box-notif-subTitle');
    txt12.innerText = 'Pièces jointes';
    var conttxt13 = makeElement('div');
    conttxt13.setAttribute('class', 'row-collection');
    for (var i = 0; i < data.files.length; i++) {
        var btnDown = makeElement('button');
        btnDown.setAttribute('class', 'btn-download');
        btnDown.innerText = data.files[i];
        btnDown.addEventListener('click', function () {
            console.log('download');
        });
        conttxt13.appendChild(btnDown);
    }
    cont6.appendChild(txt12);
    cont6.appendChild(conttxt13);
    // cont 7
    var btn1 = makeElement('button');
    btn1.setAttribute('class', 'btn-no m-top-20 radiusLeft margin-r-5');
    btn1.innerText = 'Refuser';
    // // BUTTON ACCEPTER
    btn1.addEventListener('click', function () {
        console.log('Refuser');
    });
    var btn2 = makeElement('button');
    btn2.setAttribute('class', 'btn-acc m-top-20 radiusRight');
    btn2.innerText = 'Accepter';
    btn2.addEventListener('click', function () {
        console.log('Accepter');
    });
    cont7.appendChild(btn1);
    cont7.appendChild(btn2);
    // //
    container.appendChild(cont1);
    container.appendChild(cont2);
    container.appendChild(cont3);
    container.appendChild(cont4);
    container.appendChild(cont5);
    container.appendChild(cont6);
    container.appendChild(cont7);
    // 
    document.getElementById('container').appendChild(container);
}
// 

function makeElement(type) {
    return document.createElement(type);
}
//Historique patient click

var patientRow = document.getElementsByClassName('patientRow');


for(var i=0;i<patientRow.length;i++)
{
    patientRow[i].addEventListener("click",()=>{
        if( document.querySelector('.fitBox_Customized').style.display == "block")
        {
           document.querySelector('.fitBox_Customized').style.display="none";
        }
        else
        {
           document.querySelector('.fitBox_Customized').style.display="block";
        }

    })
}

//Page contact send message 

var Btn_send = document.getElementById('msgSend');

Btn_send.addEventListener('click',()=>{
  
   var t = document.getElementsByClassName('sentMessage');
 

   var msg = document.getElementById('msgInput');
   // if(msg.value.length>1)
   // {
       
       var node = document.createElement("span");
        
       var textnode = document.createTextNode(msg.value);   
       t[0].appendChild(textnode);     

   // }
   // else
   // {
   //     alert('message vide');
   // }

    
})

//video call 
var btn_video = document.getElementsByClassName('call_click');

btn_video[0].addEventListener('click',()=>{
    var video_call = document.getElementsByClassName('bigBoxPhoneCall');
     
    video_call[0].style.display="block";
})
var btn_video = document.getElementsByClassName('hangout');

btn_video[0].addEventListener('click',()=>{
    var video_call = document.getElementsByClassName('bigBoxPhoneCall');
     
    video_call[0].style.display="none";
})
// php actions 

var Btn_AgeFilter = document.getElementById('id_ageFilter');

Btn_AgeFilter.addEventListener('click',()=>{
   
})
