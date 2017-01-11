var express = require('express');
var router = express.Router();
var User = require("../models/users");

// GET /login
router.get("/login", function(req, res, next){
    return res.render('login', { title: 'Login'});
});

// POST /login information
router.get("/login", function(req, res, next){
    //hash submitted password, check with database for username& password
    return res.send("Logged In!");
})

// GET /profile
router.get("/profile", function(req, res, next){
    return res.render('profile', { title: 'Profile'});
});

// GET /register
router.get('/register', function(req, res, next){
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
