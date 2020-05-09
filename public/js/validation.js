
document.getElementById("btnLogin").addEventListener("click",(e)=>{
    var Email = document.getElementById("email").value;
var Mot_passe = document.getElementById("password").value;
    if(Email == "" || Mot_passe == ""){
        e.preventDefault();
        alert("Vous devez remplir les chmps ");
    }
});
