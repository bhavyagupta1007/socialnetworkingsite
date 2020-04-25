const mongoose = require('mongoose');

const resetSchema= new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accesstoken:
    {
        type:String,
        required:true,
        unique:true
    },
    isValid:
    {
        type: Boolean,
        required:true
    }
},{
    timestamps:true
});


const Reset=mongoose.model('Reset',resetSchema);
module.exports=Reset;