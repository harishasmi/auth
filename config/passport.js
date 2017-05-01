var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("../models/user");

// Copied from Passport Authntication docs
// The user details are saved in the req.user object after the deserializerUser method

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// done(err) - If there is a DB error.. Check docs
// done(null, false)  - If there is an error with the user returned. Like wrong passport or no user exists with that name
// done(null, user) - If the user is returned succesfully then the second argument would contain the created user



passport.use('local.login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true            // Pass the req to callback. You can see it in the next line
    },  
    function(req, email, password, done) {      // You can see it in action here
        User.findOne({ email : email }, function(err, user) {
          if (err) { return done(err); }        // DB Error
          if (!user) {                          // User doesn't exist error
            req.flash("loginError", "No User account exists in the application with this email");
            return done(null, false);
            // Can be combined like this as well.
            // return done(null, false, req.flash("loginError", "No User account exists in the application with this name"));
          }
          // Check for password incorrect error.
          if(!user.validatePassword(req.body.password)){
            return done(null, false, req.flash("loginError", "Passowrd is incorrect"));
          }
          return done(null, user, req.flash("welcomeFlash", "Welcome back " + user.fullname));  
          // Everything is okay and return the user
        });
     }
));

// Helpful Tutorials
// https://www.youtube.com/watch?v=DGTvjcgWt00
// https://scotch.io/tutorials/easy-node-authentication-setup-and-local
// http://stackoverflow.com/questions/31407425/passport-js-always-executing-failureredirect

// Need to worry about the  process.nextTick(function(){ ... 

passport.use('local.signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true            // Pass the req to callback. You can see it in the next line
    },  
    function(req, email, password, done) {      // You can see it in action here
        User.findOne({ email : email }, function(err, user) {
          if (err) { return done(err); }        // Database Error
          if (user) {                           // User already exists
            return done(null, false, req.flash("signupError",'User account already exists in the application with the same name.'));
          }
          // Since no user exists we need to create the user account
          var newUser = new User();
          newUser.fullname = req.body.name;
          newUser.email = req.body.email;
          newUser.password = newUser.encryptPassword(req.body.password);   // This is how you execute methods of mongoose
          
          newUser.save(function(err){
              if(err){
                  return done(err);
              }
              else{
                  // User got saved here in the database
                  return done(null, newUser, req.flash("welcomeFlash", "Successfully Signed Up user " + newUser.fullname));  
                  // newUser details would be available in req.user object globally
              }
          })
        });
     }
));