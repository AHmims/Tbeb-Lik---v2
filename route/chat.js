const express = require('express');
const router = express.Router();
// 
const _DB = require('../model/dbQuery');
const {
    isAuth
} = require('../config/auth');
const {
    canAccessChatRoute
} = require('../helper/helpers');

router.get('/:consultation', isAuth, async (req, res) => {
    const canAccess = await canAccessChatRoute(req.user.userId, req.user.userType, req.params.consultation);
    if (canAccess) {
        res.render('chat', {
            userName: req.user.userName,
            userEmail: req.user.userEmail,
            userType: req.user.userType.toLowerCase(),
            messages: await _DB.getMessages(req.user.userId, req.params.consultation)
        });
    } else res.redirect('/dashboard');
});
// 
// 
module.exports = router;