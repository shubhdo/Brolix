const mongoose = require('mongoose');
const Address = require('./Address');

const Schema = mongoose.Schema;


const User = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter the last name'],
        match: [/^[A-Za-z]+$/, 'Only alphabets are allowed'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter the email'],
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
        unique: [true, 'email already registered'],
        trim: true
    },
    password:{
      type:String,
        required: [true, 'Please enter the password'],
    },
    dob: {
        type: Date,
        required: [true, 'Please enter DOB'],
    },
    telephone_no: {
        type: Number,
        required: [true, 'Please enter the contact no'],
        match: [/^[0-9]{10,14}$/, 'Only numeric value is allowed(10-14 digits only']

    },
    address: {
        type: Address,
        trim: true
    },
    profile:{
        type:String
    },
    description:
        {
            type:String,
            required:[true, 'Please enter your description']
        },
    posts:{
        type: Schema.Types.ObjectId, ref: 'Post',
    }
});

module.exports = mongoose.model('User', User, 'User');