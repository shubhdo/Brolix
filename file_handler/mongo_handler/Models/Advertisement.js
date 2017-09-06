const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let Advertisement=new Schema({
    ad_type:{
        type:String,
        required:[true,'Please enter the ad type(Cash or Coupon)'],
        enum:['Cash','Coupon']
    },
    description:{
        type:String,
        required:[true,'Some Description is required'],
        match: [/^[A-Za-z0-9% ]{2,}$/, 'Only alphabets are allowed']
    },
    winner_id:[{
        type:Schema.Types.ObjectId, ref: 'User'
    }],
    viewed_by:[{
        type:Schema.Types.ObjectId, ref: 'User'
    }],
    winner_limit:{
      type:Number
    },
    limitReach:{
      type:Number
    },
    expired:{
       type:Boolean,
       default:false
    },
    on_page:{
        type:Schema.Types.ObjectId, ref: 'Page'
    },
    status_active:{
        type:Boolean,
        default:true
    }
});

module.exports = mongoose.model('Advertisement', Advertisement, 'Advertisement');