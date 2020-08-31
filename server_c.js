//PACKAGES DECLARATION
const __FS = require('fs');
const __FSE = require('fs-extra');
const __EXPRESS = require('express');
const __APP = __EXPRESS();
const __EXPRESS_LAYOUTS = require('express-ejs-layouts');
const __PASSPORT = require('passport');
const __FLASH = require('connect-flash');
const __SESSION = require('express-session');
const __SERVER = require('http').createServer(__APP);
const __IO = require('socket.io')(__SERVER);
const __PATH = require('path');

//GLOBAL VARIABLES
const __PORT = process.env.PORT || 8080;
//MIDDLEWARES
// passport config
require('./config/passport')(__PASSPORT);
__APP.use(__EXPRESS.urlencoded({
    extended: true
}));
__APP.use(__EXPRESS.json());
__APP.use(__EXPRESS.static(__dirname));
__APP.use(__EXPRESS.static(__PATH.join(__dirname, 'public')));
__APP.use(__SESSION({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
__APP.use(__PASSPORT.initialize());
__APP.use(__PASSPORT.session());

__APP.use(__FLASH());
__APP.use((req, res, next) => {
    res.locals.flash_N_msg = req.flash('flash_N_msg');
    res.locals.flash_E_msg = req.flash('flash_E_msg');
    res.locals.flash_W_msg = req.flash('flash_W_msg');
    res.locals.flash_S_msg = req.flash('flash_S_msg');
    // ARRAY OF ERRORS
    res.locals.flash_E_array = req.flash('flash_E_array');
    // PASSPORT GLOBAL VAR
    res.locals.error = req.flash('error');
    // 
    next();
});
__APP.use(__EXPRESS_LAYOUTS);
__APP.set('view engine', 'ejs');
__APP.set("layout extractScripts", true)
// 
// 
// Include routes
__APP.use('/', require('./route/root'));
__APP.use('/', require('./route/auth'));
__APP.use('/api', require('./route/api'));
__APP.use('/chat', require('./route/chat'));
// 
// SOCKET
__IO.on('connection', socket => {
    require('./config/socket')(socket);
});
// 
//START SERVER
__SERVER.listen(__PORT, '0.0.0.0', () => {
    console.log(`Server started...\nListening on port ${__PORT}\nhttps://localhost:${__PORT}`);
});