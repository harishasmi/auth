var express = require("express");
var router = express.Router();

var passport = require("passport");

router.get("/", function(req, res){
   res.render("index"); 
});

router.get("/signup", function(req, res){
   res.render("signup", {signupError : req.flash("signupError")}); 
});



router.post('/signup', passport.authenticate('local.signup', 
  { 
     successRedirect: '/profile',
     failureRedirect: '/signup',
     failureFlash: true,
  })
);
  


router.get("/login", function(req, res) {
    res.render("login", {loginError : req.flash("loginError")});
});

router.post("/login", passport.authenticate('local.login', 
  { 
     successRedirect: '/profile',
     failureRedirect: '/login',
     failureFlash: true,
  })
);


router.get("/profile",isLoggedIn, function(req, res) {
   // console.log(req.user);  The req.user that is available as a global object. These has data from the database
   // req.flash('welcomeFlash', "Welcome user " + req.user.fullname);  // What was I thinking. This is not how it works. It will give you same thing everytime
    res.render("profile", {user : req.user, welcomeFlash : req.flash("welcomeFlash")});   // Since the req.user object would be available globally
});

router.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/");
});


module.exports = router;


function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
      return next();
   }
   res.redirect("/login");
}