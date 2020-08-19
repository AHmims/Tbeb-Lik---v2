module.exports = {
    isAuth: (req, res, next) => {
        if (req.isAuthenticated())
            return next();
        req.flash('flash_E_msg', `Vous devez se connecter d'abord`);
        res.redirect('/login');
    }
}