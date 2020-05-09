var state = false,
    styles = ["fit-content", '0'];
document.getElementById('formDropDownSelected').addEventListener('click', (e) => {
    document.getElementById('formDropDownExtension').style.height = styles[+state];
    state = !state;
});
// 
var dropDownItems = document.getElementsByClassName('formDropDownItem');
for (let i = 0; i < dropDownItems.length; i++) {
    dropDownItems[i].addEventListener('click', (e) => {
        var placeHolder = dropDownItems[i].children[0].innerText;
        dropDownItems[i].children[0].innerText = document.getElementById('formDropDownSelected').children[0].innerText;
        document.getElementById('formDropDownSelected').children[0].innerText = placeHolder;
        document.getElementById('navMenuTextCont').children[0].innerText = placeHolder;
    });
}