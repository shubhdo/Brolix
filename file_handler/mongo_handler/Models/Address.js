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

    }
})
module.exports=Address;