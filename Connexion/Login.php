<?php 
//requirement
require_once '../Database/database.php';
require '../include/function.php';
//variable
$Matricule = $password = $Nom = $prenom = $dateNaissence = $Tel =  "" ;
$status2 = false;
//insertion
 if(!empty($_POST)){
     $Matricule = checkInput($_POST['Mtrcl']);
     $password = $_POST["pwd"];
     $db = Database::connect();
$statement = $db->prepare("select MATRICULE_PAT,PASSWORD,NOM_PAT,Prenom_PAT,Date_Naissence from patients where MATRICULE_PAT = ?");
$statement->execute(array($Matricule));
$item = $statement->fetch();
if($item["MATRICULE_PAT"] == $Matricule){
   $Nom =  $item["NOM_PAT"];
   $prenom = $item["Prenom_PAT"];
   $dateNaissence = $item["Date_Naissence"];
    $status2 = true;
}
else{
    $status2 = false;
}

if($status2){
    echo "hello";
     session_start();
     $_SESSION["Matricule"] = $Matricule;
     $_SESSION["password"] = $password;
     $_SESSION["NOM_PAT"] = $Nom;
     $_SESSION["Prenom_PAT"] = $prenom;
     $_SESSION["D_Nais"] = $dateNaissence;
     header("location:../app/html/ocp_patient_formulaire.php");
}else{
    echo $item["MATRICULE_PAT"];
    header("location:../app/Login/Login_patient.php?status =" . $status2);
}
   
Database::disconnect();
 }else{
    header("location:../index.php"); 
}
 ?>