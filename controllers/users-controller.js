const User=require('../models/user');
const Reset=require('../models/resetpasstoken');
const fs=require('fs');
const path=require('path');
const forgotMailer=require('../mailers/forgot');
const crypto=require('crypto');
const Friendship=require('../models/friendship');
module.exports.profile= async function(req,res)
{
    try
    {
        let user=await User.findById(req.params.id,);
       /*.populate({
        path: 'friendships',
        populate:
         [{
 
            path: 'to_user'
        },{
            path: 'from_user'
        }]
       });*/
        //check if already friends via both routes
        let existingFriend=await  Friendship.findOne({
            from_user:req.user._id,
            to_user:user._id
        });
        if(!existingFriend)
        {
             existingFriend= await Friendship.findOne({
             from_user:user._id,
             to_user:req.user._id
         });
        }
        //if they are already friends then remove them as friends
        if(existingFriend)
        {
            return res.render('user_profile',
            {   
                title:'User Profile',
                profile_user: user,
                content:'Remove Friend'
             });

        }
        else
        {
          
            return res.render('user_profile',
            {   
                title:'User Profile',
                profile_user: user,
                content:'Add Friend'
             });

        }
    }
    catch(err)
    {
        console.log('Error in finding profile');
        return res.redirect('/');
    }
}
       
   
       

module.exports.update=async function(req,res)
{
    if(req.user.id== req.params.id)
    {
        try
        {
            let user= await User.findById(req.params.id);
            //to be able to read from multipart form
            User.uploadedAvatar(req,res,function(err){
                if(err)
                {
                    console.log("multer error",err);
                }
                user.name=req.body.name;
                user.email=req.body.email;
                if(req.file)
                {
                    if(user.avatar)
                    {
                         fs.unlinkSync(path.join('__dirname','..',user.avatar))
                    }
                    //saving the path of uploaded file in the field avatar of user
                    user.avatar= User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }
        catch(err)
        {
            req.flash('error',err);
            return res.redirect('back');
        }
    }
    else
    {
        req.flash('error','Unauthorized');
        res.status(401).send('Unauthorized');
    }
}

module.exports.signIn=function(req,res)
{
    if(req.isAuthenticated()){
      return res.redirect('/users/profile');
    }
    return res.render('signin',{
        title:'Codeial sign in'
    });
}

module.exports.signUp=function(req,res)
{
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }
    return res.render('signup',{
         title:'codeial sign up'
    });
}
//sign up
module.exports.create=function(req,res)
{
    if(req.body.password!=req.body.confirm_password)
    {
        return res.redirect('back');
    }
    User.findOne({email:req.body.email},function(err,user)
    {
        if(err)
        {
            console.log("Error n finding user in sign up");
            return
        }
        if(!user)
        {
            User.create(req.body,function(err,user)
            {
                if(err)
                {
                    console.log("Error in creating user while sign up");
                    return
                } 
                return res.redirect('/users/sign-in');
            })
        }
        else
        {
            return res.redirect('back');
        }

    });
}
//sign in and create session
module.exports.createSession=function(req,res)
{
    req.flash('success','Logged in Successfully');
     return res.redirect('/');
}

module.exports.destroySession=function(req,res){
    req.logout();
    req.flash('success','You have logged out');
    return res.redirect('/');
}

//for forgot passowrd
module.exports.forgot=function(req,res)
{ 
        return res.render('forgot',
        {
            title:'Forgot',
        });
}

//once forgot button has been pressed after submitting mail
module.exports.forgotbuttonpressed=function(req,res)
{
    User.findOne({email:req.body.email},function(err,users)
    {
        if(err)
        {
            console.log("Error n finding user in forgot");
            return
        }
        console.log(users);
        Reset.create({
             user: users._id,
             accesstoken: crypto.randomBytes(20).toString('hex'),
             isValid:true
        },function(err,reset)
        {
                if(err)
                {
                    console.log("Error in creating user while sign up");
                    return
                } 
                forgotMailer.sendemail(req.body.email,reset.accesstoken);
                return res.redirect('/');
        })
    });
   
}

module.exports.forgotmailopened=function(req,res)
{ 
    Reset.findOne({accesstoken:req.params.id},function(err,users)
    {
        if(err)
        {
            console.log("Error n finding user in forgot");
            return
        }
        if(users.isValid==false)
        {
            return res.redirect('/');
        }
        return res.render('main_forgot',
        {
            title:'Forgot Password',
            user: users
        })
    });

}
module.exports.changepassword=function(req,res)
{ 
    if(req.body.password!=req.body.confirm_password)
    {
        return res.redirect('back');
    }
    Reset.findOne({accesstoken:req.params.id},function(err,resetusers)
    {
        if(err)
        {
            console.log("Error n finding user in changing password");
            return
        }
        User.findById(resetusers.user,function(err,user)
        {
           user.password=req.body.password;
           resetusers.isValid=false;
           resetusers.save();
           user.save();
           return res.redirect('/');
        });
    });

}
