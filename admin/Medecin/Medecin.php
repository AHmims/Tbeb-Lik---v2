<?php
 require '../../include/function.php';
 require '../../Database/database.php';
     $status = false;
     $search  = "";
     session_start();
     if( $_SESSION["user"] == null){
        header("Location:http://localhost/Tbeb-Lik---v2/admin/Login.php");
     }else{
      if(!empty($_POST)){
       $search = checkInput($_POST["name"]);
          $status = true;
        
      }
     }
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>PARTIE MEDECINE</title>
	<link rel="stylesheet" href="../css/styles.css">
  <script src="https://kit.fontawesome.com/b99e675b6e.js"></script>
  <script  src="https://kit.fontawesome.com/b99e675b6e.js"></script>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
  <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
  <link href="../../app/img/logoadmin.png" rel="icon" type="image/png">
	<script>
		$(document).ready(function(){
			$(".hamburger").click(function(){
			   $(".wrapper").toggleClass("collapse");
			});
		});
	</script>
</head>
<body>

<div class="wrapper">
  <div class="top_navbar">
    <div class="hamburger">
       <div class="one"></div>
       <div class="two"></div>
       <div class="three"></div>
    </div>
    <div class="top_menu">
      <div class="logo"><img src="../../public/icon/logo_full.svg"> </div>
      <form class="form" role="form" action="Medecin.php" method="post"enctype="multipart/form-data">
      <ul>
        <li>
         
          <input type="text" placeholder="rechercher" name="name" id="search">
         
        </li>
       <li>
       <button type="submit" style="background-color:white;border:none;outline:none;" >
       <a>
          <i class="fas fa-search"></i></a> 
</button>
          </li>
          <li><a href="Medecin.php"> 
          <i class="fas fa-user"></i>
          </a></li>
      </ul>
      </form>
    </div>
  </div>
  
  <div class="sidebar">
      <ul>
        <li><a href="../index.php" >
          <span class="icon"><i class="fas fa-home"></i></span>
          <span class="title">ACCEUIL</span></a></li>
        <li><a href="#" class="active">
          <span class="icon"><i class="fas fa-user"></i></span>
          <span class="title">MEDECIN</span>
          </a></li>
        <li><a href="../Patient/patient.php">
          <span class="icon"><i class="fas fa-address-card"></i></span>
          <span class="title">PATIENT</span>
          </a></li>
        <li><a href="#" >
          <span class="icon"><i class="fas fa-project-diagram"></i></span>
          <span class="title">MAINTENANCE</span>
          </a></li>
        <li><a href="../Loguot.php">
          <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
          <span class="title">DECONNECTER</span>
          </a></li>
    </ul>
  </div>
  
  <div class="main_container">
    <!-- <h1 class="title">Tbeb Lik</h1> -->
    <div class="container admin">
        
        <div class="row">
            
        <h1>Liste des Medecin</h1>
       
          <a class="btn-main" href="Ajoute.php">Ajouter</a> 
            <table class="table table-striped table-bordered">
            <thead>
                <tr>
                <th>Nom</th>
                <th>Telephone</th>
                <th>EMAIL</th>
                <th>Matricule</th>
                <th>Spécialiter</th>
                <th>Disponible</th>
                <th>Action</th>
                
                </tr>
            </thead>
            <tbody> 
            <tr>
            <?php 
             
             $db = Database::connect();
            if($status){
              try{
              $statement = $db->prepare("select Matricule_Med,NOM_SPEC,NOM_MED,TEL,EMAIL,DISPONIBLE from medecin,specialites where  medecin.ID_SPEC = specialites.ID_SPEC And  medecin.NOM_MED = ? or Matricule_Med = ?");
              $statement->execute(array($search,$search));
              while($item = $statement->fetch())
              {
                if($item["DISPONIBLE"] == true){
                  $item["DISPONIBLE"] = "vrai";
                }else{
                  $item["DISPONIBLE"] = "faux";
                }
                  
             echo      '<tr>';
             echo    '<td>' . $item['NOM_MED'] .  '</td>';
             echo    '<td>' . $item['TEL'] .  '</td>';
             echo    '<td>' . $item['EMAIL'] .  '</td>';
             echo    '<td>' . $item['Matricule_Med'] .  '</td>'; 
             echo    '<td>' . $item['NOM_SPEC'] .  '</td>'; 
             echo    '<td>' . $item['DISPONIBLE'] .  '</td>'; 
             echo   '<td width=300>';
             echo   '<a class="btn btn-primary" href="Modifier.php?id=' .$item['Matricule_Med'] . '"><span class="glyphicon glyphicon-pencil"></span> Modifier </a>';
             echo ' ';
             echo     '<a class="btn btn-danger" href="Suppression.php?id=' .$item['Matricule_Med'] . '"><span class="glyphicon glyphicon-remove"></span> delete </a>'; 
             echo    '</td>';
             
             echo '</tr>';     
              }
            }catch(Exception $e){
                die('Erreur : ' . $e->getMessage());
            }    
              }else{ 
              $statement = $db->query("select Matricule_Med,NOM_SPEC,NOM_MED,TEL,EMAIL,DISPONIBLE from medecin,specialites where medecin.ID_SPEC = specialites.ID_SPEC ");
              while($item = $statement->fetch())
              {
                if($item["DISPONIBLE"] == true){
                  $item["DISPONIBLE"] = "vrai";
                }else{
                  $item["DISPONIBLE"] = "faux";
                }
                  
             echo      '<tr>';
             echo    '<td>' . $item['NOM_MED'] .  '</td>';
             echo    '<td>' . $item['TEL'] .  '</td>';
             echo    '<td>' . $item['EMAIL'] .  '</td>';
             echo    '<td>' . $item['Matricule_Med'] .  '</td>'; 
             echo    '<td>' . $item['NOM_SPEC'] .  '</td>'; 
             echo    '<td>' . $item['DISPONIBLE'] .  '</td>'; 
             echo   '<td width=300>';
             echo   '<a class="btn btn-primary" href="Modifier.php?id=' .$item['Matricule_Med'] . '"><span class="glyphicon glyphicon-pencil"></span> Modifier </a>';
             echo ' ';
             echo     '<a class="btn btn-danger" href="Suppression.php?id=' .$item['Matricule_Med'] . '"><span class="glyphicon glyphicon-remove"></span> delete </a>'; 
             echo    '</td>';
             
             echo '</tr>';     
                 
                  
              }
            }
                
                
              Database::disconnect();  
                
                
                ?>  
            </tbody>
            </table>
            
            
        </div>
        
        
        </div>
  </div>
</div>
	
</body>
</html>