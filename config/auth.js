module.exports = {
    isAuth: (req, res, next) => {
        if (req.isAuthenticated())
            return next();
        req.flash('flash_E_msg', `Vous devez se connecter d'abord`);
        res.redirect('/login');
    },
    isAuth_alt: (req, res, next) => {
        if (req.isAuthenticated())
            res.redirect('/dashboard');
        else
            return next();
    },
    isAuth_api: (req, res, next) => {
        if (req.isAuthenticated())
            return next();
        require('../helper/helpers').response(res, 401);
    }
}