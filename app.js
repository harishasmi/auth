var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");

// connect-mongo. I am not using it.  Saves the session into the database.
// Useful when user refreshes the page after long time and the session would still be valid

var app = express();

mongoose.connect("mongodb://localhost/passportlocal");

// Routes
var userRoute = require("./routes/user");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(cookieParser());

app.use(session({
    secret : "my secret key",
    resave : true,
    saveUninitialized : true
}));

app.use(flash());  // Needs to be setup after cookie and session middleware
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport");

// Using routes

app.use("/",userRoute);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
});