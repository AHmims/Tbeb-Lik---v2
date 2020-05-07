<?php
     require '../../Database/database.php';
     require '../../include/function.php';
     $ID_spec   = $Matricule = $Nom = $Email = $Tele  = $specialiter =  $Disponible = $Matriculeerror = $NomError = $EmailError = $TeleError = $specialiterError = $DisponibleError  =   "" ;
     $isSuccess  = $status =  true;
     $password = "";
     $error = null;
     session_start();
     if( $_SESSION["user"] == null){
        header("Location:http://localhost/Tbeb-Lik---v2/admin/Login.php");
     }else{
         if(!empty($_POST)){
           $Matricule = checkInput($_POST['Matricule']);
           $Nom = checkInput($_POST['Nom']);
           $Email  = checkInput($_POST['Email']);
           $Tele = checkInput($_POST['Tele']);
           $specialiter = checkInput($_POST['specialiter']);
           $Disponible = checkInput($_POST['disponible']);

           if(empty($Matricule)){
 
            $Matriculeerror = "ce champ ne peut pas etre vide";
            $isSuccess = false;

           }
           if(empty($Nom)){
 
            $NomError = "ce champ ne peut pas etre vide";
            $isSuccess = false;

           }
           if(empty($Email) || !filter_var($Email, FILTER_VALIDATE_EMAIL)){
 
            $EmailError = "ce champ ne peut pas etre vide";
            $isSuccess = false;

           }
           if(empty($Tele) || strlen($Tele) != 10){
            $TeleError = "ce champ ne peut pas etre vide";
            $isSuccess = false;

           }
           if($specialiter == "Specialiter"){
            $specialiterError = "ce champ ne peut pas etre vide";
            $isSuccess = false;
           }
           if($Disponible == "Disponible"){
            $DisponibleError = "ce champ ne peut pas etre vide";
            $isSuccess = false;
           }

    if($isSuccess){
        try{
            $db = Database::connect();
            $statement1 = $db->prepare("select ID_SPEC from specialites where Nom_SPEC = ?");
            $statement1->execute(array($specialiter));
            $ID_spec = $statement1->fetch();
            if($Disponible == "Vrai"){
                $Disponible = true;
            }else{
                $Disponible = false;
            }
            $password = $Nom . $Matricule;
            $statement = $db->prepare("Insert into medecin (Matricule_Med,ID_ADMIN,ID_SPEC,NOM_MED,TEL,EMAIL,DISPONIBLE,PASSWORD) value(?,?,?,?,?,?,?,?)");
            $statement->execute(array($Matricule,1,$ID_spec["ID_SPEC"],$Nom,$Tele,$Email,$Disponible,$password));   
            Database::disconnect();
            header("Location: Ajoute.php");
        }catch(Exception $e){
            die('Erreur : ' . $e->getMessage());

        }
    }
    
         }
     }
?>

<!DOCTYPE html>
<html>
<head>
<title>ADMIN</title>
    <meta charset="utf-8">
    <style><?php file_get_contents("css_file.css");?></style>
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
 <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
 <link rel="stylesheet" href="../css/style2.Css">
 <link href="../../app/img/logoadmin.png" rel="icon" type="image/png">
    <link href='http://fonts.googleapis.com/css?family=Holtwood+One+SC' rel='stylesheet' type="text/css">
</head>
    <body>

        <div class="container admin" >
        <a href="../../index.php">
                <img src="../../public/img/Logo_vertical.svg" class="LOGO" alt="logo">
        </a>
        <div class="row" style="margin-top:65px;">
                <br>
            <form class="form" action="Ajoute.php" id="formulaire" method="post">
            <h1><strong>Ajouter  un  Medecin</strong></h1>
            <div class="form-group" enctype="multipart/form-data">
                <!-- <labe for="name">Matricule: </labe> -->
                <input type="text" name="Matricule"  id="name" placeholder="Matricule"   value="">
                <span class="help-inline"  style="color:red"> 
                <?php echo $Matriculeerror; ?>
                </span>
                
                </div>   
                 <div class="form-group">
                <!-- <labe for="description">Nom </labe> -->
                <input type="text" name="Nom"  id="description" placeholder="Nom"   value="">
                <span class="help-inline"  style="color:red"> 
                <?php echo $NomError; ?>
                </span>
                
                </div>   
                 <div class="form-group">
                <!-- <labe for="price">EMail: </labe> -->
                <input type="text" name="Email"  placeholder="EMAIL"  id="point"  value="">
                <span class="help-inline"  style="color:red"> 
                <?php echo $EmailError; ?>
                </span>
                
                </div>   
                <div class="form-group">
                    <!-- <labe for="price">Telephone: </labe> -->
                    <input type="number" name="Tele"   id="point" placeholder="06XXXXXXXX"   value="">
                    <span class="help-inline"  style="color:red"> 
                    <?php echo $TeleError; ?>
                    </span>
                    
                    </div>   
                    
                        <div class="form-group">
                            <!-- <labe for="price">Disponible: </labe> -->
                            <select   id="exampleFormControlSelect2" name="disponible">
                                <option>Disponible</option>
                                <option>Vrai</option>
                                <option>Faux</option>
    </select>
                            <span class="help-inline"  style="color:red"> 
                            <?php echo $DisponibleError;?>
                            </span>
                            
                            </div>      
                        <div class="form-group">
                            <!-- <label for="exampleFormControlSelect2">Spécialiter</label> -->
                            <select name="specialiter"   id="exampleFormControlSelect2">
                            <option>Specialiter</option>
                            <?php 
                            
                
                            $db = Database::connect();
                            
                            $statement = $db->query("select NOM_SPEC from specialites");
                            while($item = $statement->fetch())
                            {
   echo    '<option>' . $item["NOM_SPEC"] .'</option>';
                            }
    ?>
     </select>
                            <span class="help-inline"  style="color:red"> 
                            <?php echo $specialiterError;?>
                            </span>
                            
                            </div> 

                
                 
                
           
            <br>
            
            <div class="form-actions">
            
            <button type="submit" class="btn btn-success" > <span class="glyphicon glyphicon-pencil"></span>Ajouter   </button>
   <a class="btn btn-primary" href="Medecin.php"> <span class="glyphicon glyphicon-arrow-left"></span> Retour</a>            
            </div>
                 </form>
               
            
            
            
       
            
           
            
        </div>
        
        
        </div>
    
        <div id="footer">
            <span>@Copyright 2020. All right reserved.</span>
        </div>
    
    </body>
</html>