const nodeMailer = require("nodemailer");

const sendEmail = async (options)=>{
    const transporter = nodeMailer.createTransport({
        service:process.env.SMPT_SERVICE,
        port: 465,
        secure: true,
        auth:{
            user:process.env.SMPT_MAIL,//SMPT-simple mail transfer protocol
            pass:process.env.SMPT_PASSWORD
        }
    });
    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        html:options.message
    };
    const {error} = await transporter.sendMail(mailOptions)
    if(error){
        return error
    }
}


module.exports = sendEmail;