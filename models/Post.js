const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Post=new Schema({
   created_by:{
       type: Schema.Types.ObjectId, ref: 'User',
       required: [true, 'Author is required'],
   },
    status:{
       type:String
    },
    status_img:{
        type:String
    },
    fav:{
       type:Boolean
    }


},{ timestamps: { createdAt: 'created_at' }});
module.exports = mongoose.model('Post',Post, 'Post');