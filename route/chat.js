const express = require('express');
const router = express.Router();
const {
    isAuth
} = require('../config/auth');
const {
    getRefCode
} = require('../helper/helpers');

router.get('/:consultation', isAuth, (req, res) => {
    res.render('chat', {
        userName: req.user.userName,
        userEmail: req.user.userEmail,
        userType: req.user.userType.toLowerCase()
    });
});
// 
// 
module.exports = router;