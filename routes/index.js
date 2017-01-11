var express = require('express');
var router = express.Router();

// GET /register
router.get('/register', function(req, res, next){
    return res.render('register', { title: 'Sign Up'});    
});

//POST /register
router.post('/register', function(req, res, next){

});

//GET /
router.get('/', function(req, res, next){

});
