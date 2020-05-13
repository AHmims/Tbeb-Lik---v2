// params = {
//     content: "text",
//     type: "normal/success/error/warning",
//     behavior: {
//         type: "normal/advanced", //controls is needed when going context/advanced
//         controls: [{ // or null
//             type: "link/button",
//             appearance: "link/main/sec",
//             text: "text",
//             callback: myClickFunction() / "/link/Url" / "cancel"
//         }, {
//             type: "link/button",
//             appearance: "link/main/sec",
//             text: "text",
//             callback: myClickFunction() / "/link/Url" / "cancel"
//         }]
//     },
//     duration: "active/100/300..."
// }
function toast(params) {
    console.log(params);
    return new Promise(function (resolve, reject) {
        try {
            //#region
            // 
            var containerFull = null,
                container = null
            containerExists = false;
            if (document.getElementById('toasts')) {
                containerExists = true
                containerFull = document.getElementById('toasts');
                container = document.getElementById('toastsContainer');
            } else {
                containerFull = document.createElement('div');
                containerFull.setAttribute('id', 'toasts');
                // 
                container = document.createElement('div');
                container.setAttribute('id', 'toastsContainer');
            }
            // 
            // 3 > 2 =>
            if (container.children.length > 2) {
                // 0 => 1 (3-2)
                for (let i = 0; i < container.children.length - 2; i++) {
                    container.children[i].remove();
                }
            }
            if (container.children.length == 2) {
                for (let i = 0; i < container.children.length; i++) {
                    container.children[i].classList.add('toastHide');
                    if (i == 0)
                        container.children[i].classList.add('toastHideLast');
                }
            } else if (container.children.length == 1)
                container.children[0].classList.add('toastHide');
            // 
            //#endregion
            // 
            var toast = document.createElement('div');
            var toastText = document.createElement('span');
            // 
            toast.setAttribute('class', 'toastBox');
            toastText.setAttribute('class', 'toastText');
            // 
            toastText.innerHTML = params.content;
            // 
            switch (params.type) {
                case 'error':
                    toast.classList.add('toastError');
                    break;
                case 'success':
                    toast.classList.add('toastSuccess');
                    break;
                case 'warning':
                    toast.classList.add('toastWarning');
                    break;
                case 'normal':
                    break;
                default:
                    throw "params.type doesn't seem to be a valid value";
            }
            // 
            switch (params.duration) {
                case 'active':
                    var cross = document.createElement('button');
                    cross.setAttribute('class', 'toastCross');
                    cross.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.293031 1.29299C0.480558 1.10552 0.734866 1.0002 1.00003 1.0002C1.26519 1.0002 1.5195 1.10552 1.70703 1.29299L6.00003 5.58599L10.293 1.29299C10.3853 1.19748 10.4956 1.1213 10.6176 1.06889C10.7396 1.01648 10.8709 0.988893 11.0036 0.987739C11.1364 0.986585 11.2681 1.01189 11.391 1.06217C11.5139 1.11245 11.6255 1.1867 11.7194 1.28059C11.8133 1.37449 11.8876 1.48614 11.9379 1.60904C11.9881 1.73193 12.0134 1.86361 12.0123 1.99639C12.0111 2.12917 11.9835 2.26039 11.9311 2.38239C11.8787 2.5044 11.8025 2.61474 11.707 2.70699L7.41403 6.99999L11.707 11.293C11.8892 11.4816 11.99 11.7342 11.9877 11.9964C11.9854 12.2586 11.8803 12.5094 11.6948 12.6948C11.5094 12.8802 11.2586 12.9854 10.9964 12.9877C10.7342 12.9899 10.4816 12.8891 10.293 12.707L6.00003 8.41399L1.70703 12.707C1.51843 12.8891 1.26583 12.9899 1.00363 12.9877C0.741432 12.9854 0.49062 12.8802 0.305212 12.6948C0.119804 12.5094 0.0146347 12.2586 0.0123563 11.9964C0.0100779 11.7342 0.110873 11.4816 0.293031 11.293L4.58603 6.99999L0.293031 2.70699C0.10556 2.51946 0.000244141 2.26515 0.000244141 1.99999C0.000244141 1.73483 0.10556 1.48052 0.293031 1.29299Z" fill="black"/>
            </svg>`;
                    cross.addEventListener('click', function () {
                        toast.classList.add('toastFadeOut');
                        setTimeout(() => {
                            toast.remove();
                        }, 400);
                        resetToasts(container, toast);
                        resolve(false);
                    });
                    toast.appendChild(cross);
                    break;
                default:
                    setTimeout(() => {
                        toast.classList.add('toastFadeOut');
                        setTimeout(() => {
                            toast.remove();
                        }, 400);
                        resetToasts(container, toast);
                        resolve(false);
                    }, params.duration);
            }
            // 
            if (params.behavior.type == "advanced") {
                if (!(!params.behavior.controls)) {
                    if (typeof (params.behavior.controls) == "object") {
                        if (params.behavior.controls.length > 0) {
                            var btnsCount = 0;
                            var btnsContainer = document.createElement('div');
                            btnsContainer.setAttribute('class', 'toastsButtonsContainer');
                            params.behavior.controls.forEach(control => {
                                var btn = document.createElement('button');
                                btn.setAttribute('class', 'toastButton');
                                if (control.type == "link") {
                                    btn = document.createElement('a');
                                    btn.setAttribute('class', 'toastLink');
                                    btn.setAttribute('href', control.callback);
                                } else {
                                    btnsCount++;
                                    if (control.callback == "true") {
                                        btn.onclick = function () {
                                            toast.classList.add('toastFadeOut');
                                            setTimeout(() => {
                                                toast.remove();
                                            }, 400);
                                            resetToasts(container, toast);
                                            resolve(true);
                                        }
                                    } else if (control.callback == "cancel") {
                                        btn.onclick = function () {
                                            toast.classList.add('toastFadeOut');
                                            setTimeout(() => {
                                                toast.remove();
                                            }, 400);
                                            resetToasts(container, toast);
                                            resolve(false);
                                        }
                                    } else {
                                        btn.onclick = async function () {
                                            var btnClickResult = await control.callback();
                                            if (btnClickResult) {
                                                toast.classList.add('toastFadeOut');
                                                setTimeout(() => {
                                                    toast.remove();
                                                }, 400);
                                                resetToasts(container, toast);
                                            } else console.error('Callback function returned with  a value of => False');
                                            resolve(Boolean(btnClickResult));
                                        }
                                    }
                                    if (control.appearance == "sec")
                                        btn.classList.add('buttonSecondary');
                                    else btn.classList.add('buttonMain');
                                }
                                btn.innerText = control.text;
                                // 
                                if (control.type == "link")
                                    toastText.appendChild(btn);
                                else
                                    btnsContainer.appendChild(btn);

                            });
                            if (btnsContainer.children.length > 0)
                                toast.appendChild(btnsContainer);
                            // 
                            toast.appendChild(toastText);
                            if (btnsCount > 0)
                                toast.appendChild(btnsContainer);
                        } else throw "The Controls attribute should be an array and have more than 1 entry";
                    } else throw 'Type of the Controls attribute should be an object';
                } else throw "The Controls attribute can't be empty or null";

            } else toast.appendChild(toastText);
            // 
            // 
            // 
            // 
            container.appendChild(toast);
            if (!containerExists) {
                containerFull.appendChild(container);
                document.body.appendChild(containerFull);
            }
        } catch (err) {
            console.error(err);
        }
    });
}
// 
function creatToastContainer(text, controls) {
    return new Promise(function (resolve, reject) {
        // controls =| 0 | 1 | 2
        // TYPES : no controls | 'X' button top right | 'Ok' button | 'Yes'/'No'
        // 
        var box = document.createElement('div');
        var text = document.createElement('span');
        // 
        box.setAttribute('class', 'toastBox');
        text.setAttribute('class', 'toastText');
        // 
        text.innerText = text;
        box.appendChild(text);
        // 
        switch (controls) {
            case 1:
                var cross = document.createElement('button');
                cross.setAttribute('class', 'toastCross');
                cross.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.293031 1.29299C0.480558 1.10552 0.734866 1.0002 1.00003 1.0002C1.26519 1.0002 1.5195 1.10552 1.70703 1.29299L6.00003 5.58599L10.293 1.29299C10.3853 1.19748 10.4956 1.1213 10.6176 1.06889C10.7396 1.01648 10.8709 0.988893 11.0036 0.987739C11.1364 0.986585 11.2681 1.01189 11.391 1.06217C11.5139 1.11245 11.6255 1.1867 11.7194 1.28059C11.8133 1.37449 11.8876 1.48614 11.9379 1.60904C11.9881 1.73193 12.0134 1.86361 12.0123 1.99639C12.0111 2.12917 11.9835 2.26039 11.9311 2.38239C11.8787 2.5044 11.8025 2.61474 11.707 2.70699L7.41403 6.99999L11.707 11.293C11.8892 11.4816 11.99 11.7342 11.9877 11.9964C11.9854 12.2586 11.8803 12.5094 11.6948 12.6948C11.5094 12.8802 11.2586 12.9854 10.9964 12.9877C10.7342 12.9899 10.4816 12.8891 10.293 12.707L6.00003 8.41399L1.70703 12.707C1.51843 12.8891 1.26583 12.9899 1.00363 12.9877C0.741432 12.9854 0.49062 12.8802 0.305212 12.6948C0.119804 12.5094 0.0146347 12.2586 0.0123563 11.9964C0.0100779 11.7342 0.110873 11.4816 0.293031 11.293L4.58603 6.99999L0.293031 2.70699C0.10556 2.51946 0.000244141 2.26515 0.000244141 1.99999C0.000244141 1.73483 0.10556 1.48052 0.293031 1.29299Z" fill="black"/>
            </svg>`;
                cross.addEventListener('click', function () {
                    box.remove();
                    resolve('Removed');
                });
                box.appendChild(cross);
                break;
        }
        // 
    });
}
// 
function resetToasts(container, toast) {
    switch (container.children.length) {
        case 2:
            if (toast == container.children[1]) {
                container.children[0].classList.remove('toastHide');
            }
            break;
        case 3:
            switch (toast) {
                case container.children[2]:
                    container.children[0].classList.remove('toastHideLast');
                    container.children[1].classList.remove('toastHide');
                    break;
                case container.children[1]:
                    container.children[0].classList.remove('toastHideLast');
                    break;
            }
            break;
    }
}