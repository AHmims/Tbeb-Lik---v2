const express = require('express');
const router = express.Router();
const {
    isAuth
} = require('../config/auth');
const {
    getRefCode
} = require('../helper/helpers');

router.get('/', (req, res) => {
    res.render('index');
});
// 
router.get('/dashboard', isAuth, async (req, res) => {
    // console.log(req.user);
    let _data = {};
    // 
    if (req.user.userType != 'Visitor') {
        _data.refCode = await getRefCode(req.user.userId);
        //_data.inbox = // PRECONSULTATIONS
        // _data.clients = //CONSULTATIONS
    }
    // else{
    // _data.preCons = //LAST PRECONSULTATION
    // }
    // console.log(_data);
    // 
    res.render(req.user.userType == 'Visitor' ? 'dashboard_visitor' : 'dashboard_client', {
        userName: req.user.userName,
        userEmail: req.user.userEmail,
        extra: _data
    });
});

module.exports = router;