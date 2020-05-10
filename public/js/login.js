$(document).ready(async () => {
    if (localStorage.getItem('matricule')) {
        await logmeIn(localStorage.getItem('matricule'));
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
        localStorage.setItem('matricule', matriculeId);
        if (response == 'Medecin')
            window.location.href = "/medecin/notifications";
        else
            window.location.href = "/patient/form";
    }
}