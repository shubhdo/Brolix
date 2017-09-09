const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const Admin = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter the email'],
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
        unique: [true, 'email already registered'],
        trim: true
    },
    password:{
        type:String,
        required:[true,'Please enter the password']
    }

});

module.exports = mongoose.model('Admin', Admin, 'Admin');