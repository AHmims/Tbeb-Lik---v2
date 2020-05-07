<?php
require '../include/function.php';
require '../Database/database.php';
$email = $password = $erreur  = "";
$status = true;
if(!empty($_POST)){
  $email = checkInput($_POST["Mtrcl"]);
  $password = checkInput($_POST["pwd"]);
  $db = Database::connect();
  $stmt = $db->query("SELECT EMAIL,PASSWORD FROM admin");
  while ($row = $stmt->fetch()){
    if($row['EMAIL'] == $email && $row['PASSWORD'] == $password){
        session_start();
       $_SESSION["user"] = $row['EMAIL'];
       $_SESSION["mtp"] = $row['PASSWORD'];
       $_SESSION["ID"] = $row['ID_ADMIN'];
       header("Location: index.php");
    }else{
        $status = false;
        $erreur = "Erreur form n'est pas valide";
    }
}
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../public/css/login_OCP.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link href="../app/img/logoadmin.png" rel="icon" type="image/png">
    <title>Login</title>
</head>

<body>
    <div id="content">
        <a href="../index.php">
        <img src="../public/img/Logo_vertical.svg" alt="logo">
</a>
<?php if(!$status) :?> 
<div class="alert alert-danger" role="alert">
Mot de passe ou bien Email n'est pas valide 
</div>
<?php endif?>

        <form id="form" method="POST" action="" >
            <h1>Admin</h1>
            <div class="inputCont">
                <span>Email :</span>
                <input type="text" id="email" name="Mtrcl">
            </div>
            <div class="inputCont">
                <span>Mot de passe :</span>
                <input type="password" id="password" name="pwd">
            </div>
            <!-- <input id="btnLogin" type="submit">Login</button> -->
         <a><input type="submit" id="btnLogin" value="Login"></a>   
</form>
    </div>
    <script src="../app/js/validation.js"></script>
</body>

</html>