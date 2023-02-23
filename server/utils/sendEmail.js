const nodeMailer = require("nodemailer");

const sendEmail = async (options)=>{
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port : 587,
        auth:{
            user: 'merntestpjt@gmail.com',//SMPT-simple mail transfer protocol
            pass: 'lbqzjwzgtjirzmur'
        }
    });
    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        html:options.message
    };
    await transporter.sendMail(mailOptions);
}


module.exports = sendEmail;