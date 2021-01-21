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

async function task(i, array1) {
    return new Promise(function (resolve, reject) {
        try {
            setTimeout(() => {
                iframe.src = array1[i];
                iframe.contentWindow.scroll(0, 3000);
                // 
                resolve(true);
            }, 5000 * i);
        } catch (err) {
            resolve(false);
            console.error(err);
        }
    });
}




function toast(params) {
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
                    cross.innerHTML = `<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.29279 6.30529C6.48031 6.11782 6.73462 6.0125 6.99979 6.0125C7.26495 6.0125 7.51926 6.11782 7.70679 6.30529L11.9998 10.5983L16.2928 6.30529C16.385 6.20978 16.4954 6.1336 16.6174 6.08119C16.7394 6.02878 16.8706 6.00119 17.0034 6.00004C17.1362 5.99888 17.2678 6.02419 17.3907 6.07447C17.5136 6.12475 17.6253 6.199 17.7192 6.29289C17.8131 6.38679 17.8873 6.49844 17.9376 6.62133C17.9879 6.74423 18.0132 6.87591 18.012 7.00869C18.0109 7.14147 17.9833 7.27269 17.9309 7.39469C17.8785 7.5167 17.8023 7.62704 17.7068 7.71929L13.4138 12.0123L17.7068 16.3053C17.8889 16.4939 17.9897 16.7465 17.9875 17.0087C17.9852 17.2709 17.88 17.5217 17.6946 17.7071C17.5092 17.8925 17.2584 17.9977 16.9962 18C16.734 18.0022 16.4814 17.9014 16.2928 17.7193L11.9998 13.4263L7.70679 17.7193C7.51818 17.9014 7.26558 18.0022 7.00338 18C6.74119 17.9977 6.49038 17.8925 6.30497 17.7071C6.11956 17.5217 6.01439 17.2709 6.01211 17.0087C6.00983 16.7465 6.11063 16.4939 6.29279 16.3053L10.5858 12.0123L6.29279 7.71929C6.10532 7.53176 6 7.27745 6 7.01229C6 6.74712 6.10532 6.49282 6.29279 6.30529V6.30529Z" fill="#0D0C22"/>
                    <rect x="0.75" y="0.75" width="22.5121" height="22.5" rx="8.25" stroke="#0D0C22" stroke-width="1.5"/>
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
                            params.behavior.controls.reverse().forEach(control => {
                                var btn = document.createElement('button');
                                btn.setAttribute('class', 'toastButton');
                                if (control.type == "link") {
                                    btn = document.createElement('a');
                                    btn.setAttribute('class', 'toastLink');
                                    btn.setAttribute('href', control.callback);
                                    btn.setAttribute('target', 'blank');
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
                                    if (control.appearance == 'main')
                                        btn.classList.add('buttonMain');
                                    else if (control.appearance == "sec")
                                        btn.classList.add('buttonSecondary');
                                    else
                                        btn.classList.add('buttonAlt');
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
                cross.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.15164 5.1515C5.37667 4.92654 5.68184 4.80016 6.00004 4.80016C6.31823 4.80016 6.6234 4.92654 6.84844 5.1515L12 10.3031L17.1516 5.1515C17.2623 5.03689 17.3947 4.94547 17.5412 4.88258C17.6876 4.81969 17.845 4.78659 18.0044 4.7852C18.1637 4.78382 18.3217 4.81418 18.4692 4.87452C18.6167 4.93485 18.7506 5.02396 18.8633 5.13663C18.976 5.2493 19.0651 5.38328 19.1254 5.53076C19.1858 5.67823 19.2161 5.83625 19.2147 5.99558C19.2134 6.15492 19.1802 6.31238 19.1174 6.45879C19.0545 6.60519 18.963 6.73761 18.8484 6.8483L13.6968 11.9999L18.8484 17.1515C19.067 17.3778 19.188 17.6809 19.1852 17.9956C19.1825 18.3102 19.0563 18.6112 18.8338 18.8337C18.6113 19.0562 18.3104 19.1824 17.9957 19.1851C17.6811 19.1878 17.378 19.0669 17.1516 18.8483L12 13.6967L6.84844 18.8483C6.62211 19.0669 6.31899 19.1878 6.00435 19.1851C5.68972 19.1824 5.38874 19.0562 5.16625 18.8337C4.94376 18.6112 4.81756 18.3102 4.81483 17.9956C4.81209 17.6809 4.93305 17.3778 5.15164 17.1515L10.3032 11.9999L5.15164 6.8483C4.92667 6.62327 4.80029 6.3181 4.80029 5.9999C4.80029 5.68171 4.92667 5.37654 5.15164 5.1515Z" fill="black"/>
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
