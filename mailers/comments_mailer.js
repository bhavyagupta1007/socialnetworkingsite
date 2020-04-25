const nodeMailer = require('../config/nodemailer');
 
//another way for exporting a method
exports.newComment = (comment)=>{
    let htmlString=nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');
    nodeMailer.transporter.sendMail({
        from: 'bhavya@gmail.com',
        to: comment.user.email,
        subject: 'New Comment Published!',
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