const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Card = new Schema({
    price: {
        type: Number,
        required: ['true', "Card price is required"]
    },
    no_of_chances: {
        type: Number,
        required: ['true', "No of chances are required"]
    },
    buyers:[{
        type: Schema.Types.ObjectId, ref: 'User'
    }]
})

module.exports=mongoose.model('Card',Card,'Card');
