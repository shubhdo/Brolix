const mongoose = require('mongoose');
const Address = require('./Address');

const Schema = mongoose.Schema;


const User = new Schema({


    firstname: {
        type: String,
        required: [true, 'Please enter the last name'],
        match: [/^[A-Za-z]{2,20}$/, 'Only alphabets are allowed'],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, 'Please enter the last name'],
        match: [/^[A-Za-z]{2,30}$/, 'Only alphabets are allowed'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter the email'],
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
        unique: [true, 'email already registered'],
        trim: true
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
    gender:{
        type:String,
        required:[true,'Please enter the gender(male or female)'],
        enum:['male','female']
    },
    address: {
        type: Address,
        trim: true
    },
    profile:{
        type:String
    },
    blocked:{
        type:Boolean,
        default:false
    },
    pages:[{
        type: Schema.Types.ObjectId, ref: 'Page'
    }],

    viewed_ads:[{
    type:Schema.Types.ObjectId, ref: 'Advertisement'
    }],
    status_active:{
        type:Boolean,
        default:true
    }
});

module.exports = mongoose.model('User', User, 'User');