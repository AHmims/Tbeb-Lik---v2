<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="public/css/home_OCP.css">
    <title>PlayGround</title>
</head>

<body>
    <div id="landing">
        <header id="navBar">
            <div id="navBarIn">
                <a href="#">
                    <img src="public/icon/logo_full.svg" alt="logo" id="navBarLogo">
                </a>
                <div id="navBarNavText">
                    <button id="btnLogin">
                        <a href="public/html/identification.php">
                        <img src="public/icon/lock.svg" alt="lockicon">
                         S’identifier
                         </a>
                    </button>
                </div>
            </div>
        </header>
        <div id="body">
            <div id="bodyContent"
                style="background-image: url('app/img/banner-left.svg'),url('app/img/banner-right.svg');">
                <h1>
                    La consultation
                    En tout temps.
                    En tout lieu.
                </h1>
                <span>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tempus mi
                    tristique auctor nibh. Ultrices sed neque, turpis id mi, luctus.
                </span>
                <button>
                    Consulter
                </button>
            </div>
            <a href="#content" id="scrollIcon">
                <img src="public/icon/line.svg" alt="scroll">
            </a>
        </div>
    </div>
    <div id="content">
        <div id="imageVisualizer" style="background-image: url('app/img/Login_interface.svg');">
        </div>
        <!--  -->
        <div id="contentNavigation">
            <div class="navigationBox navigationBoxHighlited">
                <div class="navigationBoxRow">
                    <img src="public/icon/home/icon1.svg" alt="" class="navigationBoxImage">
                    <span class="navigationBoxTitle">Part Title</span>
                </div>
                <span class="navigationBoxDesc">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit,
                    sint?</span>
            </div>
            <div class="navigationBox">
                <div class="navigationBoxRow">
                    <img src="public/icon/home/icon1.svg" alt="" class="navigationBoxImage">
                    <span class="navigationBoxTitle">Part Title</span>
                </div>
                <span class="navigationBoxDesc">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit,
                    sint?</span>
            </div>
            <div class="navigationBox">
                <div class="navigationBoxRow">
                    <img src="public/icon/home/icon1.svg" alt="" class="navigationBoxImage">
                    <span class="navigationBoxTitle">Part Title</span>
                </div>
                <span class="navigationBoxDesc">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit,
                    sint?</span>
            </div>
        </div>
    </div>
    <div id="footing">
        <div id="banner" style="background-image: url('app/img/waves.svg');">
            <div>
                <img src="public/img/youcode.png" id="img1" alt="youcode">
                <img src="public/img/ocp.png" alt="ocp">
            </div>
        </div>
        <div id="footer">
            <span>@Copyright 2020. All right reserved.</span>
        </div>
    </div>
    <script src="public/js/home_ocp.js"></script>
</body>

</html>