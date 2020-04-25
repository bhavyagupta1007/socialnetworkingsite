const User=require('../models/user');
const Friendship=require('../models/friendship');
module.exports.toggleFriend=async function(req,res)
{
    try
    {
               //friends/add/?to_user=ghijk
               //based on removed we will add/remove friends
               let removed=false;
               let fromUser= await User.findById(req.user._id).populate('friendships');
               let toUser=await User.findById(req.query.to_user).populate('friendships');

               //check if already friends via both routes
               let existingFriend= await Friendship.findOne({
                   from_user:req.user._id,
                   to_user:req.query.to_user
               });
               if(!existingFriend)
               {
                    existingFriend= await Friendship.findOne({
                    from_user:req.query.to_user,
                    to_user:req.user._id
                });
               }
               //if they are already friends then remove them as friends
               if(existingFriend)
               {
                   fromUser.friendships.pull(existingFriend._id);
                   fromUser.save();
                   toUser.friendships.pull(existingFriend._id);
                   toUser.save();
                   existingFriend.remove();
                   removed=true;
               }
               else
               {
                  //make a new friend
                  let newFriend= await Friendship.create({
                    from_user:req.user._id,
                    to_user:req.query.to_user
                  });
                  fromUser.friendships.push(newFriend._id);
                  toUser.friendships.push(newFriend._id);
                  fromUser.save();
                  toUser.save();

               }
               if(req.xhr)
               {
                    return res.json(200,{
                     message: 'Successful in adding/removing friends',
                    data:
                     {
                         removed: removed
                    }
                    });
                }
                return res.redirect('/');
    }
    catch(err)
    {
        console.log(err);
        return res.json(500,{
            message: 'Internal Server Error',
            
        });
    }
}