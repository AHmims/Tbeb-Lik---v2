const __EXPRESS = require('express');
const router = __EXPRESS.Router();
const passport = require('passport');
// 
const _CLASSES = require('../model/classes');
const _DB = require('../model/dbQuery');
// 
// GET REQUESTS
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/c-register', (req, res) => {
    res.render('signup_client');
});
router.get('/v-register', (req, res) => {
    res.render('signup_visitor');
});
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('flash_N_msg', 'Déconnecté');
    res.redirect('/');
});
// 
// POST REQUESTS
router.post('/register', (req, res) => {
    console.log(req.body);
    // 
    const {
        userName,
        userPass,
        userConPass
    } = req.body;
    res.render('register', {
        userName,
        userPass,
        userConPass
    });
    //maybe redirect on success to login page
});
router.post('/login', (req, res, next) => {
    // console.log(req.body);
    // const helpers = require('../helpers/helpers')
    // helpers.response(res, 400, 'ffffff');
    // 
    // 
    // req.flash('flash_msg', 'test message');
    // res.redirect('./login');
    // 
    // 
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: './login',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;