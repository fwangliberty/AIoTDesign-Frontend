var express = require('express');
var router = express.Router();
//var bodyParser = require('body-parser')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
router.use(expressValidator());

// var session = require('express-session');
// router.use(session({
  // secret: 'secret',
  // resave: false,
  // saveUninitialized: false,
  // cookie: {maxAge : 3600}
// }))

// var connectFlash = require('connect-flash');

// // Connect-Flash
// router.use(connectFlash());



// Include User Model
var User = require('../models/user');
// Include Student Model
var Student = require('../models/student');
// Include Instructor Model
var Instructor= require('../models/instructor');

// create application/x-www-form-urlencoded parser
//var urlencodedParser = bodyParser.urlencoded({ extended: false });

//===============PASSPORT=================
// Passport session setup.
passport.serializeUser(function(user, done) {
  //console.log("serializing " + user.username);
  done(null, user);
});
 
passport.deserializeUser(function(id, done) {
  console.log("deserializing " + id);
  User.getUserById(id, function (err,user) {
   done(err, user);
  });
});


passport.use(new LocalStrategy(
  function(username, password, done) {
	console.log(username);
	console.log(password);
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
         return done(null, false, {
            message: 'Unknown USER'
         });
      }

    User.comparePassword(password, user.password, function(err, isMatch) {
       if (err) throw err;
       if (isMatch) {
          return done(null, user);
       } else {
		  console.log('Invalid Password');
          return done(null, false, {
            message: 'Invalid password'
          });
       }
    });
  });
})); 

// User Register
router.get('/register', function(req, res, next) {
  res.render('users/register');
});

router.get('/login', function(req, res, next) {
  res.render('users/login', {title:'Login'});
});

// Register User
router.post('/register', function(req, res, next) {
//router.post('/register', urlencodedParser, function(req, res, next) {
  // Get Form Values
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var street_address = req.body.street_address;
  var city = req.body.city;
  var state = req.body.state;
  var zip = req.body.zip;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var type = req.body.type;
 
  // Form Validation 
  req.check('first_name', 'First name field is required').notEmpty();
  req.check('last_name', 'Last name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email must be a valid email address').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  
  if(errors){
     res.render('users/register', {
       errors: errors
     });
   } else {
    var newUser = new User({
         email: email,
         username: username,
         password: password,
         type: type
    });
	if(type == 'student'){
       console.log('Registering Student...');
	   var newStudent = new Student({
         first_name: first_name,
         last_name: last_name,
         address: [{
           street_address: street_address,
           city: city,
           state: state,
           zip: zip
         }],
         email: email,
         username:username
       });
	   User.saveStudent(newUser, newStudent, function(err, user){
         console.log('Student created');
       });
    } else {
       console.log('Registering Instructor...');
	   
	   var newInstructor = new Instructor({
       first_name: first_name,
       last_name: last_name,
       address: [{
          street_address: street_address,
          city: city,
          state: state,
          zip: zip
       }],
       email: email,
       username:username
      });
	  User.saveInstructor(newUser, newInstructor, function(err, user){
         console.log('Instructor created');
      });
	}
    req.flash('success_msg', 'User Added'); 
	//req.session.user = newUser;
	res.redirect('/');
    }
});

router.post('/login',  passport.authenticate('local', {failureRedirect:'/', failureFlash: true}), function(req, res, next){ 
//router.post('/login', urlencodedParser, passport.authenticate('local', {failureRedirect:'/', failureFlash: true}), function(req, res, next){
   req.flash('success_msg', 'You are now logged in');
   var usertype = req.user.type;
   res.redirect('/'+usertype+'s/classes');
});   
 
// Log User Out
router.get('/logout', function(req, res){
  req.logout();
  //Success Message
  req.flash('success_msg', 'You have logged out');
  res.redirect('/');
});

/* router.post('/login', urlencodedParser, 
  // wrap passport.authenticate call in a middleware function
  function (req, res, next) {
    // call passport authentication passing the "local" strategy name and a callback function
    passport.authenticate('local', function (error, user, info) {
      // this will execute in any case, even if a passport strategy will find an error
      // log everything to console
      console.log("1 error:"+error);
      console.log("2 user:"+user);
      console.log("3 info:"+info);

      if (error) {
        res.status(401).send(error);
      } else if (!user) {
        res.status(401).send(info);
      } else {
        next();
      }

      res.status(401).send(info);
    })(req, res);
  },

  // function to call once successfully authenticated
  function (req, res) {
    res.status(200).send('logged in!');
  }); */

module.exports = router;
