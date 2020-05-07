$(document).ready(async () => {
    let response = await $.post('/listeConsultationFields', {}).promise();
    response = JSON.parse(response);
    console.log('/listeConsultationFields | response => ', response);
    response.villes.forEach(element => {
        let slctOption = document.createElement('option');
        slctOption.setAttribute('value', element.VILLE);
        slctOption.innerText = element.VILLE;
        // 
        document.getElementById('cityOptions').appendChild(slctOption);
    });
    //
    response.proffess.forEach(element => {
        let slctOption = document.createElement('option');
        slctOption.setAttribute('value', element.ID_SPEC);
        slctOption.innerText = element.NOM_SPEC;
        // 
        document.getElementById('profsOptions').appendChild(slctOption);
    });
    // 
    document.getElementById('btnEnvoyer').addEventListener('click', async () => {
        let ville = document.getElementById('cityOptions').options[document.getElementById('cityOptions').selectedIndex].value;
        let proffes = document.getElementById('profsOptions').options[document.getElementById('profsOptions').selectedIndex].value;
        // 
        sendNotification(ville, proffes);
        // let response = await $.post('')
    });
    // 
    // CHECK IF THE PATIENT HAVE ANY ONGOING NOTIFICATIONS
    // IF YES ADD A BTN FOR HIM TO GO TO THE CONTACT PAGE
    let exists = await $.post('/listeConsultationFields', {}).promise();
    if (exists)
        addNotification();
});
// 
function addNotification() {
    // MAYBE SOME SALT AND FLAVORS HERE
    document.body.appendChild(createNotification());
}