const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer=require('../mailers/comments_mailer');
const commentEmailWorker =require('../workers/comment_email_worker');
const queue= require('../config/kue');
const Like=require('../models/like');

module.exports.create =async function(req, res)
{
    try
    {
        let post=await Post.findById(req.body.post)
        if (post)
        {
                let comment=await Comment.create({
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id
                });
    
                   //post.comments.push(comment);
                    post.comments.unshift(comment)
                    post.save();
                    let populatedComment = await Comment.findById(comment._id).populate('user','-password').exec();
                    let populatedPost = await Post.findById(post._id).populate('user','-password').exec();
                   // commentsMailer.newComment(populatedComment);

                   //the job is enqueued in the queue
                  let job= queue.create('emails',comment).save(function(err){
                       if(err)
                       {
                           console.log('error in sending to the queue',err);
                           return;
                       }
                       console.log('Job enqueued',job.id);
                   });
                    if(req.xhr)
                    {
                        return res.status(200).json({
                           data: {
                               comment: populatedComment,
                               post: populatedPost
                           },
                           message: "Comment craeted"
                        })
                    }
    
                    res.redirect('/');
        }
    }
    catch(err)
    {
            console.log('Error',err);
    }
}

module.exports.destroy = async function(req,res)
{
    try
    {
        let comment=await Comment.findById(req.params.id);
        let postId=comment.post;
        let poste=await Post.findById(postId);
         if((comment.user=req.user.id) || (poste.user=req.user.id) )
         {
             comment.remove();
             let post=await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

             //destroy the likes for this comment
             await Like.deleteMany({likeable:comment._id,onModel:'Comment'});
             if(req.xhr)
             {
                 return res.status(200).json({
                     data: {
                         comment_id: req.params.id
                     },
                     message: "Comment deleted "
                 })
             }
             return res.redirect('back');
         }
         else
         {
             return res.redirect('back');
         } 
    }
    catch(err)
    {
        console.log('Error',err);
        return ;
    }
   
}
