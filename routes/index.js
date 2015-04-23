var express = require('express');
var router = express.Router();

module.exports = function(passport){
	/* GET index page. */
	router.get('/', function(req, res, next) {
	  res.render('index', { title: 'Express' });
	});

	/* GET home page. */
	router.get('/home', isLoggedIn, function(req, res, next) {
	  res.render('home', { user: req.user, title: 'Home' });
	});

	/* GET login page. */
	router.get('/login', function(req, res, next) {
	  res.render('login', { title: 'Login', message: req.flash('loginMessage') });
	});

	router.post('/login', passport.authenticate('local-login', {
		successRedirect:'/home',
		failureRedirect:'/login',
		failureFlash : true
	}));

	/*
	app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
	*/

    /* GET register page. */
	router.get('/register', function(req, res, next) {
	  res.render('register', { title: 'Register', message: req.flash('registerMessage') });
	});

	router.get('/register', passport.authenticate('register', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash: true
	}));

    return router;
}


//module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}