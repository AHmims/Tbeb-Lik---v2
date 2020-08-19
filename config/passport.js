const {
    Strategy: localStrategy
} = require('passport-local');
const bcrypt = require('bcrypt');
const _DB = require('../model/dbQuery');
const {
    check: hashCheck
} = require('../helper/crypt');
// 
module.exports = (passport) => {
    passport.use(
        new localStrategy({
            usernameField: 'userEmail',
            passwordField: 'userPassword'
        }, async (email, password, done) => {
            // console.log(email, password);
            const db_user = await _DB.getUserAuthData('email', email);
            if (db_user != null) {
                // if (hashCheck(password, db_user.userPass))
                if (true)
                    return done(null, db_user);
                else {
                    return done(null, false, {
                        message: 'Mot de passe incorrect.'
                    });
                }
            } else {
                return done(null, false, {
                    message: `L'adresse email que vous avez fournie est incorrecte.`
                });
            }
        })
    );
    // 
    passport.serializeUser((user, done) => {
        done(null, user.userId);
    });

    passport.deserializeUser(async (id, done) => {
        const db_user = await _DB.getUserAuthData('id', id);
        if (db_user != null) {
            done(null, db_user);
        } else done(null, null);
    });
}