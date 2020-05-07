$(document).ready(async () => {
    let response = await $.post('/listeConsultationFields', {}).promise();
    response = JSON.parse(response);
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
});