const express = require('express');
const router = express.Router();
// 
const _DB = require('../model/dbQuery');
const {
    isAuth
} = require('../config/auth');
const {
    canAccessChatRoute,
    destinatorUserData,
    chatDateConstraint
} = require('../helper/helpers');

router.get('/:consultation', isAuth, async (req, res) => {
    const canAccess = await canAccessChatRoute(req.user.userId, req.user.userType, req.params.consultation);
    if (canAccess) {
        const validDate = await chatDateConstraint(req.params.consultation);
        if (validDate) {
            res.render('chat', {
                userName: req.user.userName,
                userEmail: req.user.userEmail,
                userType: req.user.userType.toLowerCase(),
                messages: await _DB.getMessages(req.user.userId, req.params.consultation),
                destinatorUserData: await destinatorUserData(req.user.userId, req.user.userType, req.params.consultation)
            });
        } else {
            req.flash('flash_E_msg', `Il est trop tôt pour accéder à la consultation actuelle`);
            res.redirect('/dashboard');
        }
    } else {
        req.flash('flash_E_msg', `Consultation introuvable`);
        res.redirect('/dashboard');
    }
});
// 
// 
module.exports = router;