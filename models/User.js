const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  
    first_name:{
        type:String,
        require:true,
    },
    middle_name:{
        type:String
    },
    last_name:{
        type:String,
        require:true
    },
    user_name: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 10
    },
    confirm_password: {
        type: String,
        require: true,
        min: 10
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);


