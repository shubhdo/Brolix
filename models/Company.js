const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');
let Schema=mongoose.Schema;

const Address=require('./Address');

let Company=new Schema({
    name:{
        type:String,
        required:[true,'Please enter the first name'],
        match:[/^[A-Za-z ]+$/,'Only alphabets are allowed'],
        lowercase:true,
        trim:true
    },
    username:{
        type:String,
        unique:true,
        required:[true,'Please enter the username'],
        trim:true
    },
    password:{
        type:String,
        required:[true,'Please enter the password'],
        trim:true,
    },
    website:{
        type:String,
        required:[true,'Please enter your website name'],
        unique:true,
        trim:true
    },
    registered_address:{
        type:Address,
        required:[true,'Please enter your registered address'],
        trim:true
    },
    headquarter_address:{
        type:Address,
        trim:true
    },
    telephone_no:{
        type:Number,
        required:[true,'Please enter your telephone number'],
    },
    description:{
        type:String
    },
    logo:{
        type:String
    },
    employees:{
        type: Schema.Types.ObjectId, ref: 'Employee'
    }


});
Company.plugin(paginate);

module.exports=mongoose.model('Company',Company,'Company');