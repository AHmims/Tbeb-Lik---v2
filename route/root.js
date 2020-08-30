const express = require('express');
const router = express.Router();
const {
    isAuth
} = require('../config/auth');
const {
    getRefCode,
    getClientNotifications,
    getConsultations,
    canSendPrecons,
    visitorCurrentConsultation,
    getVisitorConsultations
} = require('../helper/helpers');

router.get('/', (req, res) => {
    if (!req.isAuthenticated())
        res.render('index');
    else
        res.redirect('/dashboard');
});
// 
router.get('/dashboard', isAuth, async (req, res) => {
    // console.log(req.user);
    let _data = {};
    // 
    if (req.user.userType != 'Visitor') {
        _data.refCode = await getRefCode(req.user.userId);
        _data.inbox = await getClientNotifications(req.user.userId); // PRECONSULTATIONS
        _data.clients = await getConsultations(req.user.userId); //CONSULTATIONS
        // _data.history = await 
    } else {
        _data.ongoing = await canSendPrecons(req.user.userId); //LAST PRECONSULTATION
        if (_data.ongoing == false) {
            _data.consul = await visitorCurrentConsultation(req.user.userId); //CONSULTATIO EN COURS
        }
        _data.history = await getVisitorConsultations(req.user.userId); // HISTORY OF PAST CONSULTATIONS
    }
    // console.log(_data);

    res.render(req.user.userType == 'Visitor' ? 'dashboard_visitor' : 'dashboard_client', {
        userName: req.user.userName,
        userEmail: req.user.userEmail,
        extra: _data
    });
});

module.exports = router;