const express = require('express');
const router = express.Router();
const formData = require('express-form-data');
const __PATH = require('path');
// 
const options = {
    uploadDir: __PATH.join(__dirname, 'filesTmp'),
    autoClean: true
};
const {
    response,
    reqBodyTrim: _TRIM,
} = require('../helper/helpers');
// 
router.use(require('../config/auth').isAuth_api);
// 
router.post('/test', formData.parse(options), (req, res) => {
    try {
        const {
            conTitle,
            conDesc
        } = _TRIM(req.body);
        response(200, {
            conTitle,
            conDesc
        });
    } catch (err) {
        console.error(err);
        response(res, 500);
    }
    // console.log(req.body);
    // res.json(req.body);
    // res.status(500).end();
});
// 

module.exports = router;