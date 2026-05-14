const mongoose=require('mongoose');

const urlSchema=new mongoose.Schema({
    url:{
        type:String,
        required:[true,'provide the long url'],
        unique:true
    },
    shortCode:{
        type:String,
        required:[true,'provide the short code'],
        unique:true
    },
    accessCount:{
        type:Number,
        default:0
    },
    lastAccessedAt:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
});

module.exports=mongoose.model('Url',urlSchema);