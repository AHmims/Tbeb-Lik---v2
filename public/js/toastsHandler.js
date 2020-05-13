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
    let btnRes = await toast(params);
    return btnRes;
}