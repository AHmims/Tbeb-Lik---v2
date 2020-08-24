const express = require('express');
const router = express.Router();
// 
const _DB = require('../model/dbQuery');
const {
    isAuth
} = require('../config/auth');
const {
    getRefCode
} = require('../helper/helpers');

router.get('/:consultation', isAuth, async (req, res) => {
    res.render('chat', {
        userName: req.user.userName,
        userEmail: req.user.userEmail,
        userType: req.user.userType.toLowerCase(),
        messages: await _DB.getMessages(req.user.userId, req.params.consultation)
    });
});
// 
// 
module.exports = router;