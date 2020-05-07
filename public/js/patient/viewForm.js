function createNotification() {
    let cont = document.createElement('h5');
    cont.style.textAlign = "center";
    cont.innerHTML = "Un medecin à accepeter votre demande<br/><a href='/patient/contact'>Click ici pour commencer</a>";
    // 
    return cont;
}