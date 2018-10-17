const express = require('express');
const router = express.Router();


// Bring User model from /Models
let User = require('../models/user');


// Register Form

router.get('/register', function(req, res){
  res.render('register');
});


//Register Process

router.post('/register', function(req, res){
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('surname', 'Surname is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();
  if (errors){
    res.render('register',{
      errors:errors
    });
  } else{
    let newUser = new User({
      name:name,
      surname:surname,
      email:email,
      username:username,
      password:password
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'You are now registered !'); //Not Working
        req.session.save(function () {
          res.redirect('/users/login'); // go to login
        });
      }
    })
  }
});

router.get('/login', function(req,res){
  res.render('login');
});
module.exports = router ;
