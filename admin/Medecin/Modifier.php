<?php
     
     require '../../Database/database.php';
     require '../../include/function.php';
     $id =  $nom_spec =   $ID_spec = $error  =    $Matricule = $Nom = $Email = $Tele  = $specialiter =  $Disponible =  $Disponiblenum = $Matriculeerror = $NomError = $EmailError = $TeleError = $specialiterError = $DisponibleError  =   "" ;
     $isSuccess = true;
     $Disponible = "vrai";
     session_start();
     if($_SESSION["user"] == null){
        header("Location:http://localhost/Tbeb-Lik---v2/admin/Login.php");
     }else{
        if(!empty($_GET['id'])){
      
      
            $id = $_GET['id'];
            
        }
         if(!empty($_POST)){
           $Matricule = checkInput($_POST['Matricule']);
           $Nom = checkInput($_POST['Nom']);
           $Email  = checkInput($_POST['Email']);
           $Tele = checkInput($_POST['Tele']);
           $specialiter = checkInput($_POST['specialiter']);
           $Disponible = checkInput($_POST['disponible']);

           if(empty($Matricule)){
 
            $Matriculeerror = "ce champ et  vide ou bien incorrect";
            $isSuccess = false;

           }
           if(empty($Nom)){
 
            $NomError = "ce champ et  vide ou bien incorrect";
            $isSuccess = false;

           }
           if(empty($Email) ||!filter_var($Email, FILTER_VALIDATE_EMAIL)){

            $EmailError = "ce champ et  vide ou bien incorrect";
            $isSuccess = false;

           }
           if(empty($Tele) || strlen($Tele) != 10){
            $TeleError = "ce champ et  vide ou bien incorrect";
            $isSuccess = false;

           }
           if(empty($Disponible)){
               $DisponibleError = "ce champ et  vide ou bien incorrect";
           }else{
            if($Disponible == "vrai"){
                $Disponiblenum = 1;
                
               }else{
                $Disponiblenum = 0;
               }
           }
           if(empty($specialiter)){
               $specialiterError = "ce champ et  vide ou bien incorrect";
           }
           
    if($isSuccess){
        try{
            $db = Database::connect();
            $statement1 = $db->prepare("select ID_SPEC from specialites where Nom_SPEC = ?");
            $statement1->execute(array($specialiter));
            $ID_spec = $statement1->fetch();
            $id = $_POST["id"];
            $statement = $db->prepare("Update medecin set Matricule_Med = ?,ID_ADMIN = ?,ID_SPEC = ?,NOM_MED = ?,TEL = ?,EMAIL = ?,DISPONIBLE = ? where  Matricule_Med = ?");
            $statement->execute([$Matricule,1,$ID_spec["ID_SPEC"],$Nom,$Tele,$Email,$Disponiblenum,$id]);    
            Database::disconnect();
            header("Location:Medecin.php");
        }catch(Exception $e){
            die('Erreur : ' . $e->getMessage());
        }
        }
        
    }else{
            $db = Database::connect();
            $statement = $db->prepare("select * from medecin where Matricule_Med = ?");
            $statement->execute(array($id));
            $item = $statement->fetch();
            $statement1 = $db->prepare("select Nom_SPEC from specialites where ID_SPEC = ?");
            $statement1->execute(array($item["ID_SPEC"]));
            $nom_spec = $statement1->fetch();
            $Matricule = $item["Matricule_Med"];
            $Nom = $item["NOM_MED"];
            $Tele = $item["TEL"];
            $Email = $item["EMAIL"];
            if($item["DISPONIBLE"] == true){
                $Disponible = "vrai";
            }else{
                $Disponible = "faux";
            }
            
            $specialiter = $nom_spec["Nom_SPEC"];
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
    <link href='http://fonts.googleapis.com/css?family=Holtwood+One+SC' rel='stylesheet' type="text/css">
    <link href="../../app/img/logoadmin.png" rel="icon" type="image/png">
</head>
    <body>
        
        <div class="container admin" style="margin-top:65px;">
            <a href="../../index.php">
                <img src="../../public/img/Logo_vertical.svg" class="LOGO" alt="logo">
        </a>
        <div class="row">
          
                
                <br>
            <form class="form" action="Modifier.php" enctype="multipart/form-data" id="formulaire" method="post">
            <h1><strong>Modifier  un  Medecin</strong></h1>
            <div class="form-group" enctype="multipart/form-data">
                <labe for="name">Matricule: </labe>
                <input type="text"  id="name" placeholder="Matricule" name="Matricule"   value="<?php echo $Matricule; ?>">
                <input type="hidden" name="id" value="<?php echo $id;?>"/>
                <span class="help-inline" style="color:red"> 
                <?php echo $Matriculeerror; ?>
                </span>
                
                </div>   
                 <div class="form-group">
                <labe for="description">Nom </labe>
                <input type="text"  id="description" placeholder="Nom" name="Nom"   value="<?php echo $Nom; ?>">
                <span class="help-inline" style="color:red"> 
                <?php echo $NomError; ?>
                </span>
                
                </div>   
                 <div class="form-group">
                <labe for="price">EMail: </labe>
                <input type="text"  placeholder="EMAIL" name="Email"  id="point"  value="<?php echo $Email; ?>">
                <span class="help-inline" style="color:red"> 
                <?php echo $EmailError; ?>
                </span>
                
                </div>   
                <div class="form-group">
                    <labe for="price">Telephone: </labe>
                    <input type="text"  id="point" name="Tele"  placeholder="06XXXXXXXX"   value="<?php echo $Tele; ?>">
                    <span class="help-inline"  style="color:red"> 
                    <?php echo $TeleError; ?>
                    </span>
                    
                    </div>   
                        <div class="form-group">
                            <!-- <labe for="price">Disponible: </labe> -->
                            <labe for="price">Disponible: </labe>
                            <select   id="exampleFormControlSelect2" name="disponible">
                            <option><?php echo $Disponible; ?></option>
                            <?php if($Disponible == "vrai") :?> 
                                <option>Faux</option>
                               <?php endif?>
                               <?php if($Disponible == "faux") :?> 
                                <option>vrai</option>
                               <?php endif?>
                            </select>
                            <span class="help-inline"  style="color:red" > 
                            <?php echo $DisponibleError;?>
                            </span>
                            
                            </div>   
                            <div class="form-group">
                            <label for="exampleFormControlSelect2">Spécialiter</label>
                            <select name="specialiter"   id="exampleFormControlSelect2" >
                            <option><?php echo $specialiter; ?></option>
                            <?php 
                            
                
                            $db = Database::connect();
                            
                            $statement = $db->query("select NOM_SPEC from specialites");
                            while($item = $statement->fetch())
                            {
                                if($specialiter !== $item["NOM_SPEC"] ){
                                    echo    '<option>' . $item["NOM_SPEC"] .'</option>';
                                }
  
                            }
                            Database::disconnect();
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