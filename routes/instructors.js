var express = require('express');
var router = express.Router();

Class = require('../models/class');
Instructor = require('../models/instructor');
User = require('../models/user');

// var session = require('express-session');
// router.use(session({
  // secret: 'secret',
  // resave: false,
  // saveUninitialized: false,
  // cookie: {maxAge : 3600}
// }))

router.get('/classes', function(req, res, next){
	console.log('route/instructors.js: GET /classes '+ req.user.username);
   Instructor.getInstructorByUsername(req.user.username, function(err, instructor){
      if(err) throw err;
      res.render('instructors/classes', {instructor: instructor});
   });
});

router.post('/classes/register', function(req, res){
  console.log('route/instructors.js: POST /classes/register '+ req.user.username);
  info = [];
  info['instructor_username'] = req.user.username;
  info['class_id'] = req.body.class_id;
  info['class_title'] = req.body.class_title;
  Instructor.register(info, function(err, instructor){
    if(err) throw err;
    console.log(instructor);
  });
  req.flash('success_msg', 'You are now registered to teach this class');
  res.redirect('/instructors/classes');
});

router.get('/classes/:id/lessons/new', function(req, res, next){
    res.render('instructors/newlesson', {class_id:req.params.id});
});

router.post('classes/:id/lesson/new', function(req, res, next){
  //Get Values
  var info = [];
  info['class_id'] = req.params.id;
  info['lesson_number'] = req.body.lesson_number;
  info['class_id'] = req.body.lesson_title;
  info['class_id'] = req.body.lesson_body;
});

module.exports = router;

 