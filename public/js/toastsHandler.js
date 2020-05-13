async function logServerError() {
    var params = {
        content: "Une erreur s'est produite lors de l'exécution de votre demande.<br/>Si l'erreur persiste merci de nous contacter.<br/>",
        type: "error",
        behavior: {
            type: "advanced",
            controls: [{
                    type: "button",
                    appearance: "main",
                    text: "Continuer",
                    callback: "cancel"
                },
                {
                    type: "link",
                    appearance: "link",
                    text: "actualiser la page.",
                    callback: window.location.href
                }
            ]
        },
        duration: "active"
    }
    return await toast(params);
}
// 
async function logError(text) {
    var params = {
        content: text,
        type: "error",
        behavior: {
            type: "normal"
        },
        duration: 3000
    }
    return await toast(params);
}
// 
async function logSuccess(text) {
    var params = {
        content: text,
        type: "success",
        behavior: {
            type: "normal"
        },
        duration: 3000
    }
    return await toast(params);
}
// 
async function toastConfirm(text) {
    var params = {
        content: text,
        type: "normal",
        behavior: {
            type: "advanced",
            controls: [{
                    type: "button",
                    appearance: "main",
                    text: "Accepter",
                    callback: "true"
                },
                {
                    type: "button",
                    appearance: "sec",
                    text: "Refuser",
                    callback: "cancel"
                }
            ]
        },
        duration: "active"
    }
    return await toast(params);
}
// 
async function toastConfirmWarning() {
    var params = {
        content: "Est-ce que vous étés sûr de votre décision ?",
        type: "warning",
        behavior: {
            type: "advanced",
            controls: [{
                    type: "button",
                    appearance: "main",
                    text: "Accepter",
                    callback: "true"
                },
                {
                    type: "button",
                    appearance: "sec",
                    text: "Refuser",
                    callback: "cancel"
                }
            ]
        },
        duration: "active"
    }
    return await toast(params);
}
// 
async function logToast(text) {
    var params = {
        content: text,
        type: "normal",
        behavior: {
            type: "normal"
        },
        duration: 3000
    }
    return await toast(params);
}