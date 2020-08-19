const express = require('express');
const router = express.Router();
const {
    isAuth
} = require('../config/auth');

router.get('/', (req, res) => {
    res.render('index');
});
// 
router.get('/dashboard', isAuth, (req, res) => {
    // console.log(req.user);
    res.render(req.user.userType == 'Visitor' ? 'dashboard_visitor' : 'dashboard_client', {
        userName: req.user.userName
    });
});

module.exports = router;