<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/login_OCP.css">
    <title>PlayGround</title>
</head>

<body>
    <div id="content">
        <img src="../img/Logo_vertical.svg" alt="logo">
        <form method="post"  > 
            <div id="form">
                <h1>Identification</h1>
                <div class="inputCont">
                    <span>Matricule :</span>
                    <input type="text" name="matricule">
                </div>
                <div class="inputCont">
                    <span>Mot de passe :</span>
                    <input type="password" name="mdp">
                </div>
                <button  type="submit" name="login" id="btnLogin">Login</button>
            </div>
        </form >

        <?php
        
        if(isset($_POST['login'])){

            extract($_POST);

            if(!empty($matricule) && !empty($mdp))
            {
                $medecin = $patient= false;
                require '../../Database/database.php';
                // include '../Login/connexiondb.php';
                // global $db;
                //check if the doctor is the one who is connecting 
                $db = Database::connect(); 
            //     $req = $db->prepare("SELECT * FROM medecin where Matricule_Med = :matricule");

            //     $req ->execute([
            //         'matricule' => $matricule
            // ]);
            // $reponse =$req-> fetch();
            $statement = $db->prepare("select * from medecin where Matricule_Med = ?");
            $statement->execute(array($matricule));
            $reponse = $statement->fetch();
            session_start();
            if($reponse)
            {
                $medecin=true;
                $Medecin_mdp = $reponse["PASSWORD"];
                if($mdp == $Medecin_mdp){
                    $_SESSION["Matricule"] = $matricule;
                    header('Location:http://localhost/Tbeb-Lik---v2/public/html/ocp_medecin_page3'); 
                }
                else{ 
                    ?>
                    <p style=" color:red; font-size:16px;"> 
                    <?php
                        echo "Mot de passe incorrect" . $mdp . " " . $Medecin_mdp . " " .$reponse["PASSWORD"];
                    ?> </p> 
                    <?php
                }


            }
            else{
                ?>
                    <p style=" color:red; font-size:16px;"> 
                    <?php
                        echo "Le pseudo " . $matricule . " n'existe pas";
                    ?> </p> 
                    <?php
            }
                if(!$medecin)
                {
                    $statement = $db->prepare("select * from patients where MATRICULE_PAT = ?");
                    $statement->execute(array($matricule));
                    $resultat = $statement->fetch();
                    
                    if($resultat == true)
                    {
                        $lmdp = $resultat["PASSWORD"];
                        $_SESSION['nom'] = $resultat["NOM_PAT"];
                        $_SESSION['prenom'] = $resultat["Prenom_PAT"];
                        $_SESSION['matricule'] = $resultat["MATRICULE_PAT"];
                        $_SESSION['daten'] = $resultat["Date_Naissence"];
                        // $_SESSION['tel'] = $resultat->Tel;
                        if($mdp == $lmdp){
                            header('Location: ./patientForm.html'); 
                        }
                        else{ 
                            ?>
                            <p style=" color:red; font-size:16px;"> 
                            <?php
                                echo "Mot de passe incorrect";
                            ?> </p> 
                            <?php
                        }
                    }
                    else{
                        ?>
                            <p style=" color:red; font-size:16px;"> 
                            <?php
                                echo "Le pseudo " . $matricule . " n'existe pas";
                            ?> </p> 
                            <?php
                    }
                }


                Database::disconnect();  
                // var_dump($resultat);
            }
            else{
                ?>
                <p style="color:red; font-size:16px;"> 
                <?php
                    echo "Veuillez remplir tous les champs";
                ?> </p> 
                <?php
            }
        }

    ?>

        
        
       

    </div >
    <div style="height:100px"></div>
    <script src="../js/login_ocp.js"></script>
</body>

</html>