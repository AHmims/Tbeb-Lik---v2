var navigationBoxs = document.getElementsByClassName('navigationBox');
var imgs = ["Login_interface", "Patient1_interface", "Patient2_interface"];
for (let i = 0; i < navigationBoxs.length; i++) {
    navigationBoxs[i].addEventListener('click', function (e) {
        for (let j = 0; j < navigationBoxs.length; j++) {
            navigationBoxs[j].setAttribute('class', 'navigationBox');
        }
        // 
        document.getElementById('imageVisualizer').style.backgroundImage = `url(../img/${imgs[i]}.svg)`;
        navigationBoxs[i].setAttribute('class', 'navigationBox navigationBoxHighlited');
    });
}