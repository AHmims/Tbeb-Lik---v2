document.getElementById('btnLogin').addEventListener('click', async () => {
    let response = await $.post('userTypeById', {
        matricule: document.getElementById('inputMatricule').value
    }).promise();
    // 
    if (response == 'null')
        alert('Enter a diffrent id')
    else {
        sessionStorage.setItem('matricule', document.getElementById('inputMatricule').value);
        if (response == 'Medecin')
            window.location.href = "/medecin/notifications";
        else
            window.location.href = "/patient/form";
    }
});