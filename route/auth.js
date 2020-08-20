const __EXPRESS = require('express');
const router = __EXPRESS.Router();
const passport = require('passport');
// 
const _CLASSES = require('../model/classes');
const _DB = require('../model/dbQuery');
const {
    crypt
} = require('../helper/crypt');
const _VALIDATION = require('../helper/validator');
const {
    reqBodyTrim: _TRIM,
    userId: _GEN_USER_ID,
    userExists,
    refCodeExists,
    genRefCode
} = require('../helper/helpers');
const {
    getUtc: _GET_UTC
} = require('../helper/date');
const {
    isAuth_alt,
    isAuth
} = require('../config/auth');

// 
// GET REQUESTS
router.get('/login', isAuth_alt, (req, res) => {
    res.render('login');
});
router.get('/c-register', isAuth_alt, async (req, res) => {
    const expertises = await _DB.getAllData('companyExpertise');
    res.render('signup_client', {
        data_expertises: expertises != null ? expertises : []
    });
});
router.get('/v-register', isAuth_alt, (req, res) => {
    res.render('signup_visitor');
});
router.get('/logout', isAuth, (req, res) => {
    req.logOut();
    req.flash('flash_N_msg', 'Déconnecté');
    res.redirect('/');
});
// 
// POST REQUESTS
router.post('/v-register', isAuth_alt, async (req, res, next) => {
    // EXTRACT DATA FROM REQYEST BODY
    const {
        userName,
        userEmail,
        userTel,
        userSexe,
        userPass,
        userConPass,
        inviteLink
    } = _TRIM(req.body);
    // FORM VALIDATION
    const errors = _VALIDATION([{
        name: userName
    }, {
        email: userEmail
    }, {
        phone: userTel
    }, {
        sexe: userSexe
    }, {
        password: [userPass, userConPass]
    }]);
    // 
    const linkedClient = await refCodeExists(inviteLink);
    if (linkedClient == null)
        errors.push(`Lien d'invitation non valide`);
    // 
    // ON FAIL RENDER THE SAME PAGE WITH SOME PAST USER INSERTED DATA^
    if (errors.length > 0)
        renderError(errors);
    else {
        if (!await userExists(userEmail)) {
            // Hash Password
            const hashRes = await crypt(userPass);
            if (hashRes.status) {
                // GENERATE UNIQUE ID
                const userId = await _GEN_USER_ID('visitor');
                if (userId != null) {
                    // Save data in db
                    const insertRes = await _DB.insertData(new _CLASSES.visitor(userId, userName, userEmail, hashRes.data, userTel, userSexe));
                    if (insertRes > 0) {
                        const appUserInsertRes = await _DB.insertData(new _CLASSES.appUser(userId, 'Visitor', 'EMPTY', 1, linkedClient.clientId, 'TEMP', linkedClient.companyId));
                        if (appUserInsertRes > 0) {
                            // ON SUCCESS AUTO LOGIN
                            let mod_req = req;
                            mod_req.body = {
                                userEmail: userEmail,
                                userPassword: userPass
                            }
                            passport.authenticate('local', {
                                successRedirect: '/dashboard',
                                failureRedirect: './login',
                                failureFlash: false
                            })(mod_req, res, next);
                        } else {
                            await _DB.customDataDelete({
                                table: 'visitor',
                                visitorId: userId
                            });
                            renderError(["Erreur lors de l'exécution de votre demande"]);
                        }
                    } else renderError(["Erreur lors de l'exécution de votre demande"]);
                } else renderError(["Erreur lors de l'exécution de votre demande"]);
            } else renderError(["Erreur lors de l'exécution de votre demande"]);
        } else
            renderError(["Email exist déja"]);
    }
    // 
    function renderError(paramErrors) {
        res.render('signup_visitor', {
            userName,
            userEmail,
            userTel,
            flash_E_array: paramErrors
        });
    }
});
router.post('/c-register', isAuth_alt, async (req, res, next) => {
    // EXTRACT DATA FROM REQYEST BODY
    const {
        userName,
        userEmail,
        userTel,
        userPass,
        userConPass,
        // 
        companyName,
        companyDesc,
        companyEmail,
        companyTel,
        companyFJ,
        companyAdrs,
        companyEXP,
        // 
        timeZone
    } = _TRIM(req.body);
    // FORM VALIDATION
    const errors = _VALIDATION([{
        name: userName
    }, {
        email: userEmail
    }, {
        phone: userTel
    }, {
        password: [userPass, userConPass]
    }, {
        email: companyEmail
    }, {
        phone: companyTel
    }, {
        fj: companyFJ
    }]);
    // VALIDATE SOME TEXT INPUTS
    isText(`Nom d'entreprise`, companyName);
    isText(`Activité`, companyDesc);
    isText(`Adresse e-mail d'entreprise`, companyAdrs);
    // VALIDATE EXPERTISES
    if ((await _DB.getAllData('companyExpertise', `WHERE expertiseId = ${companyEXP}`)) == null)
        errors.push(`Domaine d'expertise invalide.`);
    // 
    // ON FAIL RENDER THE SAME PAGE WITH SOME PAST USER INSERTED DATA^
    if (errors.length > 0)
        renderError(errors);
    else {
        if (!await userExists(userEmail)) {
            // Hash Password
            const hashRes = await crypt(userPass);
            if (hashRes.status) {
                // GENERATE UNIQUE ID
                const userId = await _GEN_USER_ID('client');
                if (userId != null) {
                    // Save data in db
                    const clientInsertRes = await _DB.insertData(new _CLASSES.client(userId, userName, userTel, userEmail, 1, hashRes.data, _GET_UTC(), timeZone));
                    if (clientInsertRes > 0) {
                        const insertedCompanyId = await _DB.insertDataWithResponse(new _CLASSES.appCompany(companyName, companyDesc, companyTel, companyEmail, companyFJ, companyAdrs, _GET_UTC(), timeZone, companyEXP));
                        if (insertedCompanyId != null) {
                            const appUserInsertRes = await _DB.insertData(new _CLASSES.appUser(userId, 'Client', 'EMPTY', 1, null, null, insertedCompanyId));
                            if (appUserInsertRes > 0) {
                                // GENERATE UNIQUE REF CODE
                                await _DB.insertData(new _CLASSES.referral(genRefCode(), _GET_UTC(), timeZone, userId));
                                // ON SUCCESS AUTO LOGIN
                                let mod_req = req;
                                mod_req.body = {
                                    userEmail: userEmail,
                                    userPassword: userPass
                                }
                                passport.authenticate('local', {
                                    successRedirect: '/dashboard',
                                    failureRedirect: './login',
                                    failureFlash: false
                                })(mod_req, res, next);
                            } else {
                                await _DB.customDataDelete({
                                    table: 'client',
                                    clientId: userId
                                });
                                await _DB.customDataDelete({
                                    table: 'appCompany',
                                    companyId: insertedCompanyId
                                });
                                renderError(["Erreur lors de l'exécution de votre demande"]);
                            }
                        } else {
                            await _DB.customDataDelete({
                                table: 'client',
                                clientId: userId
                            });
                            renderError(["Erreur lors de l'exécution de votre demande"]);
                        }
                    } else renderError(["Erreur lors de l'exécution de votre demande"]);
                } else renderError(["Erreur lors de l'exécution de votre demande"]);
            } else renderError(["Erreur lors de l'exécution de votre demande"]);
        } else
            renderError(["Email exist déja"]);
    }
    // 
    function renderError(paramErrors) {
        res.render('signup_client', {
            userName,
            userEmail,
            userTel,
            companyName,
            companyDesc,
            companyEmail,
            companyTel,
            companyFJ,
            companyAdrs,
            flash_E_array: paramErrors
        });
    }
    // 
    function isText(field, str) {
        if (str.length <= 0)
            errors.push(`${field} non Valide.`);
    }
});
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: './login',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;