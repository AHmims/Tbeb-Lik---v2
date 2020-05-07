document.getElementById("Ajoute").addEventListener("click",()=>{
    document.getElementsByClassName("bg-modal")[0].style.display = "block";
});
document.getElementsByClassName("close")[0].addEventListener("click",()=>{
    document.getElementsByClassName("bg-modal")[0].style.display = "none";
});
var i = 0;
document.getElementById("btnLogin").addEventListener("click",()=>{
         i++;
    document.getElementById("btnLogin").value = "Veuillez attendez...";
    if(i>=2){
document.getElementById("btnLogin").disabled = "true";
    }
});
