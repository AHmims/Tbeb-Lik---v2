$(document).ready(async () => {
    if (sessionStorage.getItem('matricule')) {
        await logmeIn(sessionStorage.getItem('matricule'));
    }
});
document.getElementById('btnLogin').addEventListener('click', async () => {
    await logmeIn(document.getElementById('inputMatricule').value);
});
// 
async function logmeIn(matriculeId) {
    let response = await $.post('userTypeById', {
        matricule: matriculeId || null
    }).promise();
    // 
    if (response == 'null')
        alert('Enter a diffrent id')
    else {
        sessionStorage.setItem('matricule', matriculeId);
        if (response == 'Medecin')
            window.location.href = "/medecin/notifications";
        else
            window.location.href = "/patient/form";
    }
}