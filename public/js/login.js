$(document).ready(async () => {
    const _URL_PARAMS = new URLSearchParams(window.location.search);
    if (localStorage.getItem('authToken') && _URL_PARAMS.get('auth') == undefined) {
        _URL_PARAMS.set('auth', localStorage.getItem('authToken'));
        _URL_PARAMS.set('authId', localStorage.getItem('authId'));
        // 
        localStorage.removeItem('authToken');
        localStorage.removeItem('authId');
        // 
        window.location.search = _URL_PARAMS;
    }
    // if (localStorage.getItem('matricule')) {
    //     await logmeIn(localStorage.getItem('matricule'));
    // }
    if (_URL_PARAMS.get('err')) {
        switch (_URL_PARAMS.get('err')) {
            case 'fatal':
            case '100':
                await logServerError();
                break;
            case '104':
                await logError("Matricule n'existe pas");
                break;
            case '105':
                await logError("Le mot de passe ne correspond pas à l'utilisateur");
                break;
            default:
                await logServerError();
        }
        // 
    }
});
document.getElementById('btnLogin').addEventListener('click', async () => {
    // await logmeIn(document.getElementById('inputMatricule').value);
});
// 
async function logmeIn(matriculeId) {
    // $.ajaxSetup({
    //     headers: {
    //         'Authorization': "auth username and password"
    //     }
    // });
    // let response = await $.post('/userTypeById', {
    //     matricule: matriculeId || null
    // }).promise();
    // // 
    // if (response == 'null')
    //     logError('Entrez un matricule différent');
    // else {
    //     localStorage.setItem('matricule', matriculeId);
    //     if (response == 'Medecin')
    //         window.location.href = "/medecin/notifications";
    //     else
    //         window.location.href = "/patient/form";
    // }
    // let response = await $.post('/userAuth', {
    //     matricule: matriculeId || null
    // }).promise();
    // console.log(response);
}