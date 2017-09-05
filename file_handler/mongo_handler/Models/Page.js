const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Page=new Schema({
   created_by:{
       type: Schema.Types.ObjectId, ref: 'User',
       required: [true, 'User is required'],
   },
    page_name:{
       type:String,
        required:[true,'Some Name is required'],
        match: [/^[A-Za-z]{2,20}$/, 'Only alphabets are allowed'],

    },
    description:{
        type:String,
        required:[true,'Some Description is required'],
        match: [/^[A-Za-z]{2,}/, 'Only alphabets are allowed']
    },
    blocked:{
        type:Boolean,
        default:false
    },
    status_active:{
        type:Boolean,
        default:true
    },
    page_ads:[{
        type:Schema.Types.ObjectId, ref: 'Advertisement'
    }],

});
module.exports = mongoose.model('Page',Page, 'Page');