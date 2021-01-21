// formData= [{email:'value'},{name:'value'}...]
module.exports = (formData) => {
    const validator = require('validator');
    let errors = []
    // 
    for (const [i, data] of formData.entries()) {
        const objectKey = Object.keys(data)[0];
        const objectValue = data[objectKey];
        // 
        switch (objectKey) {
            case 'email':
                if (!validator.isEmail(objectValue)) errors.push(`Adresse e-mail non valide.`);
                break;
            case 'name':
                let name_regex = /^[a-zA-Z].*[\s\.]*$/g;
                if (!name_regex.test(objectValue)) errors.push(`Nom non valide.`);
                break;
            case 'phone':
                if (!validator.isMobilePhone(objectValue)) errors.push(`Numéro de téléphone non valide.`);
                break;
            case 'password':
                if (!validator.isAlphanumeric(objectValue[0]) || objectValue[0].length < 8) errors.push(`Mot de passe doit contenir des lettres, des chiffres et doit comporter au moins 8 caractères.`);
                else if (objectValue[0] != objectValue[1]) errors.push(`Mot de passe et sa confirmation ne correspondent pas`);
                break;
            case 'sexe':
                const sexeCollection = ['male', 'female', 'non-binary'];
                if (!sexeCollection.includes(objectValue.toLowerCase())) errors.push(`Sexe entrée non valide.`);
                break;
            case 'fj':
                const fjCollection = ['EI', 'SA', 'SARL', 'SAS', 'SNC', 'SCS', 'SCA', 'SEP', 'GIE'];
                if (!fjCollection.includes(objectValue.toUpperCase())) errors.push(`Forme juridique entrée non valide.`);
                break;
            default:
                errors.push(`Unknown validation format : ${objectKey} (position : ${i})`);
                break;
        }
    }
    // 
    return errors;
}