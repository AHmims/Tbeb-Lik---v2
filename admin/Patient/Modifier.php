<?php
     
     require '../../Database/database.php';
     require '../../include/function.php';
     $id =   $Matricule = $Nom = $Prenom = $CIN  = $DateNaissence =   $Direction =   $Matriculeerror = $NomError = $CINError =  $PrenomError = $DateNaissenceError =  $DirectionError =  "" ;
     $isSuccess = true;
     session_start();
     if($_SESSION["user"] == null){
        header("Location:http://localhost/Tbeb-Lik---v2/admin/Login.php");
     }else{
        if(!empty($_GET['id'])){
            $id = $_GET['id'];
            
        }
         if(!empty($_POST)){
           $Matricule = checkInput($_POST['MATRICULE_PAT']);
           $Nom = checkInput($_POST['Nom']);
           $Prenom  = checkInput($_POST['Prenom']);
           $CIN = checkInput($_POST['CIN']);
           $DateNaissence = checkInput($_POST['D_Nais']);
           $Direction = checkInput($_POST['Direction']);
           if(empty($Matricule)){
            $Matriculeerror = "ce champ et  vide ou bien incorrect";
            $isSuccess = false;
           }
           if(empty($Nom)){
            $NomError = "ce champ et  vide ou bien incorrect";
            $isSuccess = false;
           }
           if(empty($Direction)){
               $DirectionError = "ce champ et  vide ou bien incorrect";
               $isSuccess = false;
           }
           if(empty($Prenom)){
            $PrenomError = "ce champ et  vide ou bien incorrect";
            $isSuccess = false;
        }
        if(empty($CIN)){
            $CINError = "ce champ et  vide ou bien incorrect";
            $isSuccess = false;
        }
        if(empty($DateNaissence)){
            $DateNaissenceError = "ce champ et  vide ou bien incorrect";
            $isSuccess = false;
        }
           
    if($isSuccess){
        try{
            $db = Database::connect();
            $statement = $db->prepare("Update patients set MATRICULE_PAT = ?,NOM_PAT = ?,Prenom_PAT = ?,CIN = ?,Date_Naissence = ?,Direction = ?where  MATRICULE_PAT = ?");
            $id = $_POST["id"];
            $statement->execute([$Matricule,$Nom,$Prenom,$CIN,$DateNaissence,$Direction,$id]);     
            Database::disconnect();
            // header("Location:patient.php");
        }catch(Exception $e){
            die('Erreur : ' . $e->getMessage());
        }
        }
        
    }else{
            $db = Database::connect();
            $statement = $db->prepare("select * from patients where MATRICULE_PAT = ?");
            $statement->execute(array($id));
            $item = $statement->fetch();
            $Matricule = $item["MATRICULE_PAT"];
            $Nom = $item["NOM_PAT"];
            $Prenom = $item["Prenom_PAT"];
            $CIN = $item["CIN"];
            $DateNaissence = $item["Date_Naissence"];
            $Direction = $item["Direction"];
            Database::disconnect();
         }
     }
?>
<!DOCTYPE html>
<html>
<head>
<title>ADMIN</title>
    <meta charset="utf-8">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
 <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
 <link rel="stylesheet" href="../css/style2.Css">
 <link href="../../app/img/logoadmin.png" rel="icon" type="image/png">
    <link href='http://fonts.googleapis.com/css?family=Holtwood+One+SC' rel='stylesheet' type="text/css">
</head>
    <body>
        
        <div class="container admin">
            <a href="../../index.php">
                <img src="../../public/img/Logo_vertical.svg" class="LOGO" alt="logo">
        </a>
        <div class="row">
          
                
                <br>
            <form class="form" action="Modifier.php" id="formulaire" method="post">
            <h1><strong>Modifier  un  Patient</strong></h1>
            <div class="form-group" enctype="multipart/form-data">
                <labe for="name">Matricule: </labe>
                <input type="text" placeholder="Matricule"  id="name"  name="MATRICULE_PAT"  value="<?php echo $Matricule; ?>">
                <input type="hidden" name="id" value="<?php echo $id;?>"/>
                <span class="help-inline"> 
                <?php echo $Matriculeerror; ?>
                </span>
                
                </div>   
                 <div class="form-group">
                <labe for="description">Nom </labe>
                <input type="text" placeholder="Nom" id="description" name="Nom"   value="<?php echo $Nom; ?>">
                <span class="help-inline"> 
                <?php echo $NomError; ?>
                </span>
                
                </div>   
                 <div class="form-group">
                <labe for="price">Prenom: </labe>
                <input type="text" placeholder="EMAIL"  id="point" name="Prenom"  value="<?php echo $Prenom; ?>">
                <span class="help-inline"> 
                <?php echo $PrenomError; ?>
                </span>
                
                </div>   
                <div class="form-group">
                    <labe for="price">CIN: </labe>
                    <input type="text"  id="point" placeholder="CIN" name="CIN"   value="<?php echo $CIN; ?>">
                    <span class="help-inline"> 
                    <?php echo $CINError; ?>
                    </span>
                    
                    </div>   
                    <div class="form-group">
                        <labe for="price">Date Naissence: </labe>
                        <input type="date" placeholder="Date_Naissence"   id="point" name="D_Nais"   value="<?php echo $DateNaissence; ?>">
                        <span class="help-inline"> 
                        <?php echo $DateNaissenceError; ?>
                        </span>
                        
                        </div>      
                            <div class="form-group">
                            <labe for="price">Direction: </labe>
                            <input type="text" placeholder="Direction"  id="point"  name="Direction"  value="<?php echo $Direction; ?>">

                            <span class="help-inline"> 
                            <?php echo $DirectionError; ?>
                            </span>
                            
                            </div>     

                
                 
                
           
            <br>
            
            <div class="form-actions">
            
            <button type="submit" class="btn btn-success" > <span class="glyphicon glyphicon-pencil"></span>Ajouter   </button>
   <a class="btn btn-primary" href="patient.php"> <span class="glyphicon glyphicon-arrow-left"></span> Retour</a>            
            </div>
                 </form>
               
            
            
            
       
            
           
            
        </div>
        
        
        </div>
    
        <div id="footer">
            <span>@Copyright 2020. All right reserved.</span>
        </div>
    
    </body>
</html>