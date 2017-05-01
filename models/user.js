var mongoose = require("mongoose");
// bcryptjs has good documentation
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
    fullname : {type : String },
    email : { type : String },
    password : {type : String }
});

// Creating a method which would hash the passowrd before saving to the database. Check docs
userSchema.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync((10)));  
};

// Validating password
userSchema.methods.validatePassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

var userModel = mongoose.model("User", userSchema);
module.exports = userModel; 