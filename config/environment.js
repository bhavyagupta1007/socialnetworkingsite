const fs=require('fs');
const rfs=require('rotating-file-stream');
const path=require('path');

const logDirectory =path.join('__dirname','../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream= rfs.createStream('access.log',{
    interval:'1d',
    path: logDirectory
});


const development={
    name:'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db:'codeial_development',
    smtp:
    {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port:587,
        secure:false,
        auth: 
        {
            user: 'bigbhavya@gmail.com',
            pass: 'rajendra@212'
        } 
    },
    google_client_id: "53296731405-2ck7c3e32vfi26el6g0i0nhodmennpra.apps.googleusercontent.com",
    google_client_secret: "IIuwX-dyR7D-2xOpw57nTxFU",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeial',
    morgan:{
        mode:'dev',
        options: {stream:accessLogStream}
    }

}


const production={
    name:'production',
    asset_path: process.env.CODEIAL_asset_path,
    session_cookie_key: process.env.CODEIAL_session_cookie_key,
    db:process.env.CODEIAL_db,
    smtp:
    {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port:587,
        secure:false,
        auth: 
        {
            user: process.env.CODEIAL_user,
            pass: process.env.CODEIAL_pass
        } 
    },
    google_client_id: process.env.CODEIAL_google_client_id,
    google_client_secret: process.env.CODEIAL_google_client_secret,
    google_call_back_url: process.env.CODEIAL_google_call_back_url,
    jwt_secret: process.env.CODEIAL_jwt_secret,
    morgan:{
        mode:'combined',
        options: {stream:accessLogStream}
    }

}

module.exports= eval(process.env.CODEIAL_environment)== undefined ? development : eval(process.env.CODEIAL_environment);