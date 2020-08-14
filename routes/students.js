var express = require('express');
var router = express.Router();

Class = require('../models/class');
Student = require('../models/student');
User = require('../models/user');

// var session = require('express-session');
// router.use(session({
  // secret: 'secret',
  // resave: false,
  // saveUninitialized: false,
  // cookie: {maxAge : 3600}
// }))
 

router.get('/classes', function(req, res, next){
   console.log(req.user.username);
   Student.getStudentByUsername(req.user.username, function(err, student){
      if(err) throw err;
      res.render('students/classes', {student: student});
   });
});

router.post('/classes/register', function(req, res){
  console.log('route/students.js: POST /classes/register '+ req.user.username);
  info = [];
  info['student_username'] = req.user.username;
  info['class_id'] = req.body.class_id;
  info['class_title'] = req.body.class_title;
  Student.register(info, function(err, student){
    if(err) throw err;
    console.log(student);
  });
  req.flash('success_msg', 'You are now registered this class');
  res.redirect('/students/classes');
});

module.exports = router;