const mongoose=require('mongoose');
 const likeSchema = new mongoose.Schema({
     user:{
         type: mongoose.Schema.ObjectId
     },
     //this defines the objectid of the liked object
     likeable:{
           type: mongoose.Schema.ObjectId,
           required: true,
           //for dynamic allocation
           refPath:'onModel'
     },
     //this field is udes to define the type of the liked object since this is a dynamic reference
     onModel:{
         type: String,
         required: true,
         enum: ['Post', 'Comment']

     }
 },{
    timestamps: true
});

const Like=mongoose.model('Like',likeSchema);
module.exports= Like;