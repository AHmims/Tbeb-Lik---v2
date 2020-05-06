document.getElementById('btnLogin').addEventListener('click', () => {
    const inputs = document.getElementsByClassName('loginData');
    // 
    sessionStorage.setItem('user_M', inputs[0].value);
    // 
    var userType = document.getElementById('userSelect').selectedIndex;
    // sessionStorage.setItem('patient_P', inputs[1].value);
    // 
    var pages = ["/patient/form", "/medecin/notifications"];
    // var pages = ["/p", "/m"];

    window.location.href = pages[userType];
});