<?php 
//requirement
require_once '../include/database.php';
require '../include/function.php';
//variable
$errors = array();
$cin = $name = $email = $password = $tel   = "" ;
$status = true;
// echo "error";
//insertion
 if(!empty($_POST)){
    $name = checkInput($_POST['username']);
    $cin = checkInput($_POST['cin']);
    $email = checkInput($_POST['email']);
    $password = password_hash($_POST['pwd'],PASSWORD_BCRYPT);
    $tel = checkInput($_POST['numtele']);       
$db = Database::connect();
$statement = $db->prepare("select ID_PAT from patient where NOM_PAT = ?");
$statement->execute([$name]);
$item = $statement->fetch();
$statement = $db->prepare("select ID_PAT from patient where EMAIL = ?");
$statement->execute([$email]);
$item2 = $statement->fetch();
if($item){
    $errors["username"] = "Le nom et deja existe";
    $status = false;
}
if($item2){
    $errors["email"] = "email et deja existe";
    $status = false;
}

if($status){
        $statement = $db->prepare("Insert into patient (ID_PAT,NOM_PAT,EMAIL,PASSWORD,TEL) value(?,?,?,?,?)");
        $statement->execute(array($cin,$name,$email,$password,$tel));
        header("location:../index.php");
    }else{
        header("location:../index.php?status1 =" . $status);
       
    }
   
Database::disconnect();
}else{
    header("location:../index.php"); 
}
 ?>


