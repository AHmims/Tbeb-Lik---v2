<?php 
 require '../../include/function.php';
 require '../../Database/database.php';
 require 'PHPExcel/Classes/PHPExcel.php';
$status = false;
$isSuccess  = true;
$search = "";
$error = false;
$password = "";
     session_start();
     if( $_SESSION["user"] == null){
      header("Location:http://localhost/Tbeb-Lik---v2/admin/Login.php");
     }else{
      if(isset($_POST['name'])){
        $search = checkInput($_POST["name"]);
        $status = true; 
       }if(isset($_POST['upload_excel'])){
       $filename = $_FILES["result_file"]["name"];
       $fileTmpname = $_FILES["result_file"]["tmp_name"];
       $fileExtension = pathinfo($filename,PATHINFO_EXTENSION);
       $allowedType = array('xlsx');
       if(!in_array($fileExtension,$allowedType)){
        $error = true;
       }else{
        $db = Database::connect();      
try{
  // echo $fileTmpname;
    $inputFileType  =   PHPExcel_IOFactory::identify($fileTmpname);
    $objReader      =   PHPExcel_IOFactory::createReader($inputFileType);
    $objPHPExcel    =   $objReader->load($fileTmpname);
}catch(Exception $e){
    die('Error loading file "'.pathinfo($fileTmpname,PATHINFO_BASENAME).'": '.$e->getMessage());
}
 
//Get worksheet dimensions
$sheet = $objPHPExcel->getActiveSheet(); 
$highestRow = $sheet->getHighestRow(); 
$highestColumn = $sheet->getHighestColumn();
 $data = $sheet->toArray(null,true,true,true);
 function converttodate($donnes){
  $date = strtotime($donnes);
  $date =  date("Y-m-d",$date);
  return $date;
 }
 for($row = 2 ; $row<=sizeof($data);$row++){
  $statement = $db->prepare("Insert into patients (MATRICULE_PAT,CIN,NOM_PAT,Prenom_PAT,Date_Emb,Date_Naissence,Direction,Date_Retrait) value(?,?,?,?,?,?,?,?)");
  $statement->execute(array($data[$row]["A"],$data[$row]["B"],$data[$row]["C"],$data[$row]["D"],converttodate($data[$row]["E"]),converttodate($data[$row]["F"]),$data[$row]["G"],converttodate($data[$row]["H"])));
  $statement = $db->prepare("Update patients set PASSWORD = ? where  MATRICULE_PAT = ?");
  $password = $data[$row]["A"] . $data[$row]["C"];
  $statement->execute([$password,$data[$row]["A"]]);
 }
        Database::disconnect();

       }
 
     }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
  <title>PARTIE Patient</title>
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
      <form class="form" role="form" action="patient.php" method="post"enctype="multipart/form-data">
      <ul>
        <li>
         
          <input type="text" placeholder="rechercher" name="name" id="search">
         
        </li>
       <li>
       <button type="submit"  style="background-color:white;border:none;outline:none;" >
       <a>
          <i class="fas fa-search"></i></a> 
</button>
          </li>
          <li><a href="patient.php"> 
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
        <li><a href="../Medecin/Medecin.php" >
          <span class="icon"><i class="fas fa-user"></i></span>
          <span class="title">MEDECIN</span>
          </a></li>
        <li><a href="#" class="active">
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
    <div>
          <?php if($error == true) :?> 
<div class="alert alert-danger" role="alert">
la format n'est pas correct l'extenstion doit etre xlsx
</div>
<?php endif?>
        <div class="row">
            
        <h1>Liste des patients</h1>
       
          <a class="btn-main" id="Ajoute">Ajouter</a>  <br>
 
          </div>
            <table class="table table-striped table-bordered">
  
            <thead>
                <tr>
                <th>Matricule</th>
                <th>Nom</th>
                <th>Prenom</th>
                <th>CIN</th>
                <th>Date Naissence</th>
                <th>Direction</th>
                <th>Action</th>
                </tr>
            </thead>
            <tbody> 
            <tr>
            <?php
            $db = Database::connect();
            if($status){
              $statement = $db->prepare("select MATRICULE_PAT,NOM_PAT,Prenom_PAT,CIN,Date_Naissence,Direction from patients where NOM_PAT = ? or MATRICULE_PAT = ?  or Prenom_Pat = ? ");
              $statement->execute(array($search,$search,$search));
              while($item = $statement->fetch())
              {
             echo      '<tr>';
             echo    '<td>' . $item['MATRICULE_PAT'] .  '</td>';
             echo    '<td>' . $item['NOM_PAT'] .  '</td>';
             echo    '<td>' . $item['Prenom_PAT'] .  '</td>';
             echo    '<td>' . $item['CIN'] .  '</td>'; 
             echo    '<td>' . $item['Date_Naissence'] .  '</td>';  
             echo    '<td>' . $item['Direction'] .  '</td>'; 
             echo   '<td width="300">';
             echo   '<a class="btn btn-primary" href="Modifier.php?id=' .$item['MATRICULE_PAT'] . '"><span class="glyphicon glyphicon-pencil"></span> Modifier </a>';
             echo ' ';
             echo     '<a class="btn btn-danger" href="Suppression.php?id=' .$item['MATRICULE_PAT'] . '"><span class="glyphicon glyphicon-remove"></span> delete </a>'; 
             echo    '</td>';
             echo '</tr>';     
                 
                  
              }
              }else{ 
              $statement = $db->query("select MATRICULE_PAT,NOM_PAT,Prenom_PAT,CIN,Date_Naissence,Direction from patients LIMIT 10 ");
              $id = 1;
              while($item = $statement->fetch())
              {

             echo      '<tr>';
             echo    '<td>' . $item['MATRICULE_PAT'] .  '</td>';
             echo    '<td>' . $item['NOM_PAT'] .  '</td>';
             echo    '<td>' . $item['Prenom_PAT'] .  '</td>';
             echo    '<td>' . $item['CIN'] .  '</td>'; 
             echo    '<td>' . $item['Date_Naissence'] .  '</td>';  
             echo    '<td>' . $item['Direction'] .  '</td>'; 
             echo   '<td width="300">';
             echo   '<a class="btn btn-primary" href="Modifier.php?id=' .$item['MATRICULE_PAT'] . '"><span class="glyphicon glyphicon-pencil"></span> Modifier </a>';
             echo ' ';
             echo     '<a class="btn btn-danger" href="Suppression.php?id=' .$item['MATRICULE_PAT'] . '"><span class="glyphicon glyphicon-remove"></span> delete </a>'; 
             echo    '</td>';
             
             echo '</tr>';     
                 $id++;
                  
              }
            }         
              Database::disconnect();  
                
                
                ?>  
                        </tr>
                    
              
                
          
                
            </tbody>
            </table>
            
            
        </div>
        
        
        </div>
  </div>
</div>
<form class="bg-modal" action="" enctype="multipart/form-data" method="POST">
  <div class="modal-content2">
      <div class="close">+</div>
      <img src="../../public/img/Logo_vertical.svg"  class="LOGO" alt="logo">
      <div class="form">
        <input type="file" placeholder="fichier" name="result_file" class="entrer">
        <div class="erreur"></div>
        <!-- <input type="password" placeholder="Mot passe" name="mtp" class="entrer" onkeyup='this.value=this.value.toUpperCase()'>
        <div class="erreur"></div> -->
         <input class="button btn-main" name="upload_excel" type="submit" id="btnLogin" class="enter2" value="Ajouter">
      
  </div>
</div>
</form>
<script src="../javascript/file.js"></script>
</body>
</html>