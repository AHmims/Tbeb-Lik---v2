const bcrypt = require('bcrypt');
const saltRounds = 10;
const {
    status
} = require('../helper/helpers');
// 
const crypt = async (password) => {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return status(true, hash);
    } catch (err) {
        return status(false, err);
    }
}
// 
const check = async (password, hash) => {
    try {
        const compare = await bcrypt.compare(password, hash);
        return status(true, compare);
    } catch (err) {
        return status(false, err);
    }
}
// 
module.exports = {
    crypt,
    check
}