const express = require('express');
const router = express.Router();
router.get('/dasboard', (req, res) => {
    res.render('index');
});
// 

module.exports = router;