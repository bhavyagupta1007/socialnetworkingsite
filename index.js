const express=require('express');
const env= require('./config/environment');
const logger=require('morgan');

const cookieParser=require('cookie-parser');
const app=express();
require('./config/view-helper')(app);

const expressLayouts=require('express-ejs-layouts');

const db=require('./config/mongoose');

//used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
console.log(__dirname);

const MongoStore=require('connect-mongo')(session);
const sassMiddleware=require('node-sass-middleware');
const flash=require('connect-flash');
const customMware=require('./config/middleware');


//set up the chat server to be used with socket.io
const chatServer= require('http').Server(app);
const chatSockets= require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('cht server is listening');
const path=require('path');


if(env.name=='development')
{
    app.use(sassMiddleware({
        src: path.join('__dirname', env.asset_path,'scss'),
        dest: path.join('__dirname', env.asset_path,'css'),
        debuf: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}

app.use(express.urlencoded());

app.use(cookieParser());

const port=8000;
app.use(express.static(env.asset_path));

//to use while displaying pic from avatar in uploads
//making the upload path available to browser 
app.use('/uploads',express.static( __dirname+'/uploads'));
app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


//set up the view engine
app.set('view engine','ejs');
app.set('views','./views');
//mongo store is used to store session key in db
app.use(session({
   name:'codeial',
   secret:env.session_cookie_key,
   saveUninitialized:false,
   resave:false,
   cookie:
   {
       maxAge:(1000*60*100)
   },
   store: new MongoStore(
       {
           mongooseConnection:db,
           autoRemove:'disabled'
     },
   function(err){
       console.log(err || 'connect-mongodb setup ok');
   }
   )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
//use express router
app.use('/',require('./routes'));


app.listen(port,function(err){
    if(err)
    {
    console.log(`Error in runnng the server :${err}`);
    }
     console.log(`Server running on port:${port}`);
});