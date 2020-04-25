const Post=require('../models/post');
const Comment=require('../models/comment');
const Like=require('../models/like');
module.exports.create=async function(req,res)
{
    try
    {
        let post=await Post.create(
            {
            content:req.body.content,
            user:req.user._id
            })
            let populatedPost = await Post.findById(post._id).populate('user','-password').exec();
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post:populatedPost
                    },
                    message: "Post created!"
                })
            }
            req.flash('success','Post published');
            return res.redirect('back');
    }
    catch(err)
    {
        req.flash('error',err);
          return;
    }
}

module.exports.destroy =async function(req,res)
{
    let post=await Post.findById(req.params.id);
    try{
        if (post.user == req.user.id)
        {
            //delete all the likes of the posts and the associated comments too
            await Like.deleteMany({likeable: post,onModel: 'Post'});
            await Like.deleteMany({_id:{$in:post.comments}});
            
            post.remove();
            await Comment.deleteMany({post: req.params.id});
            if(req.xhr)
            {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted "
                })
            }
            req.flash('success','Post and associated comments deleted');
            return res.redirect('back');
        }
        else
        {
            req.flash('error','You cannot delete this post');
            return res.redirect('back');
        }
    }
    catch(err)
    {
        req.flash('error',err);
        return res.redirect('back');
    }
}
