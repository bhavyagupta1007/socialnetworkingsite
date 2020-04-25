const nodeMailer = require('../config/nodemailer');
 
//another way for exporting a method
exports.sendemail = (email,accesstoken)=>{
     htmlString=nodeMailer.renderTemplate({accesstoken:accesstoken},'/forgotviews/mailtobesent.ejs');
    nodeMailer.transporter.sendMail({
        from: 'bhavya@gmail.com',
        to: email,
        subject: 'Password change attempt in Bhavya website',
         html: htmlString
    },(err,info)=>{
        if(err)
        {
            console.log("Error in sendoing mail",err);
            return;
        }
       // console.log('Mail delivered',info);
        return;
    });
}