const passport=require('passport');
const googleStratgy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');
const env=require('./environment');

//tell passport to use a new strategy for google log in
passport.use(new googleStratgy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_call_back_url
},
//if access token expires then we use refresh token to get a new access token wthout asking user to login again
function(accessToken,refreshToken,profile, done)
{
    //find a user
    User.findOne({email: profile.emails[0].value}).exec(function(err,user)
    {
             if(err)
             {
                console.log('Error in google strategy-passport',err);
                return;
             }
             console.log(profile);
             if(user)
             {
                 //if found set this user as req.user
                 return done(null,user);
             }
             else
             {
                 //if not found , create the user and set it as req.user
                 User.create(
                     {
                     name: profile.displayName,
                     email: profile.emails[0].value,
                     password: crypto.randomBytes(20).toString('hex')
                    }, 
                    function(err,user)
                    {
                        if(err)
                        {
                           console.log('Error in creating user in google strategy-passport',err);
                           return;
                        }
                        return done(null,user);
                    });

             }
    });
}


));
module.exports =passport;