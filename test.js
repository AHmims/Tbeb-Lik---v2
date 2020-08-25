const formData = require('express-form-data');
const options = {
    uploadDir: __PATH.resolve(__dirname + '/../filesTmp'),
    autoClean: true
};
router.post('/spacialRouteDyalk', formData.parse(options), async (req, res) => {
    console.log(req.body);
    console.log(req.files);
});