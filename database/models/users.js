var mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username : 
    {
      type : String,
      required : true
    },

    password :
    {
      type:String,
      required : true,
      minlength : 5
    },

    email :
    {
      type : String,
      required : true,
      unique : true
    },
  }
);

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;