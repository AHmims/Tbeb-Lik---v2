const express = require('express');
const router = express.Router();
const {
    isAuth
} = require('../config/auth');
const {
    data
} = require('pdfkit/js/reference');

router.get('/', (req, res) => {
    res.render('index');
});
// 
router.get('/dashboard', isAuth, async (req, res) => {
    // console.log(req.user);
    const _data = {};
    // 
    if (req.user.userType != 'Visitor') {
        _data.refCode = '';
    }
    // 
    res.render(req.user.userType == 'Visitor' ? 'dashboard_visitor' : 'dashboard_client', {
        userName: req.user.userName,
        extra: data
    });
});

module.exports = router;