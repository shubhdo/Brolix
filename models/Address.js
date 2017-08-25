const mongoose = require('mongoose');
let Schema=mongoose.Schema;


let Address=new Schema({
    country: {
        type: String,
        required: [true, 'Please enter the country'],
        trim: true,
        match: [/^[A-Za-z ]+$/, 'Only Alphabets are allowed']

    },
    state: {
        type: String,
        required: [true, 'Please enter the state'],
        trim: true,
        match: [/^[A-Za-z ]+$/, 'Only Alphabets are allowed']

    },
    city: {
        type: String,
        required: [true, 'Please enter the city'],
        match: [/^[A-Za-z ]+$/, 'Only Alphabets are allowed'],
        trim: true
    }
})
module.exports=Address;