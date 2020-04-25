const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/user');
//authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback: true
},
   function(req,email,password,done)
   {
          //find a user and establish the identity
          User.findOne({email:email},function(err,user){
              if(err){
                   req.flash('error',err);
                  return done(err);
              }
              if(!user || user.password !=password){
                  req.flash('error','Invalid Username/passowrd');
                  return done(null,false);
              }
              return done(null,user);
          });
     }
));
//serializing the user to decidde which key to use in cookies
passport.serializeUser(function(user,done){
       done(null,user.id);
});
//deserializing the user from th key in cookies
passport.deserializeUser(function(id,done)
{
  /* User.findById(id,function(err,user)
    {
        if(err)
        {
            console.log('Error in deserializing in passport');
            return done(err);
        }
        console.log(user);
        return done(null,user);
    });*/
    User.findById(id)
    .populate({
       path: 'friendships',
       populate:
        [{

           path: 'to_user'
          // path: 'from_user'
       },{
           path: 'from_user'
       }]
       
    })
    .exec(function(err,user)
    {
        if(err)
        {
            console.log('Error in deserializing in passport');
            return done(err);
        }
        
        return done(null,user);
    }) 
});

//check if user is authenticated
passport.checkAuthentication=function(req,res,next){
    //if the user is signed in, pass in request to controller action
    if(req.isAuthenticated()){
        return next();
    }
    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated())
    {
        //req.user contains the current signed in user from cookie session.sending it to locals for views
        //console.log(req.user);
        
        res.locals.user=req.user;
    }
    next();
}


module.exports=passport;