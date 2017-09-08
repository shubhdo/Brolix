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
    },
    name: {
        type: String,
        required: [true, 'Please enter the last name'],
        match: [/^[A-Za-z ]{2,30}$/, 'Only alphabets are allowed'],
        trim: true
    },
    telephone_no: {
        type: Number,
        required: [true, 'Please enter the contact no'],
        match: [/^[0-9]{10,14}$/, 'Only numeric value is allowed(10-14 digits only']

    },

});

module.exports = mongoose.model('Admin', Admin, 'Admin');