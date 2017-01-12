var express = require('express');
var router = express.Router();
var User = require("../models/users");
var mid = require('../middleware');

// GET /logout

router.get('/logout', function(req, res, next){
    if(req.session) {
        //delete session object
        req.session.destroy(function(err){
            if(err){
                return next(err);
            }
            else{
                return res.redirect("/");
            }
        });
    }
});

// GET /login
router.get("/login", mid.loggedOut, function(req, res, next){
    return res.render('login', { title: 'Login'});
});

// POST /login information
router.post("/login", function(req, res, next){
    //hash submitted password, check with database for username& password
    
    //check email and password have both been entered
    if(req.body.email && req.body.password){
        User.authenticate(req.body.email, req.body.password, function(error, user){
            if(error || !user){
                var err = new Error('Wrong email or password');
                err.status = 401;
                return next(err);
            }
            else{
                req.session.userId = user._id; //this is important - this tells express to assign a session id to the current session
                //left side = the session userId --> to be stored in cookie
                //right side = user = user json document, 
                return res.redirect("/");
            }
        });
    }
    else{
        var err = new Error('Email and Password are required.');
        err.status = 401;
        return next(err);
    }
});

// GET /profile
router.get("/profile", function(req, res, next){
    if(! req.session.userId){
        var err = new Error("Login to view this page.");
        err.status = 403;
        return next(err);
    }

    //populate the profile page with information stored in Mongo
    User.findById(req.session.userId)
        .exec(function (error, user){
            if(error){
                return next(error);
            } else {
               return res.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteBook });
            }
        });
});

// GET /register
router.get('/register', mid.loggedOut, function(req, res, next){
    return res.render('register', { title: 'Sign Up'});    
});

//POST /register
router.post('/register', function(req, res, next){
    if(req.body.email &&
    req.body.name &&
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword){
        
        //confirm that user typed the same password twice
        if(req.body.password !== req.body.confirmPassword){
            var err = new Error('Passwords do not match.');
            err.status = 400;
            return next(err);
        }

        // create object with all the form information

        var userData = {
            email: req.body.email,
            name: req.body.name,
            favoriteBook: req.body.favoriteBook,
            password: req.body.password
        };

        // use schema's 'create' method to insert document into Mongo
        User.create(userData, function(error, user){
            if(error) {
                return next(error);
            } else {
                req.session.userId = user._id; //once you register, you immediately become logged in
                return res.redirect('/profile');
            }
        });

    }else {
        var err = new Error('All Fields Required');
        err.status = 400;
        return next(err);
    }
});

//GET /
router.get('/', function(req, res, next){
    return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next){
    return res.render('about', {title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next){
    return res.render('contact', { title: 'Contact'});
});

module.exports = router;
