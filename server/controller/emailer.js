import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';



// https://ethereal.email/create
let nodeConfig = {
    host: "merntestpjt@gmail.com",
    service: process.env.SMPT_SERVICE,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMPT_MAIL, // generated ethereal user
        pass: process.env.SMPT_PASSWORD, // generated ethereal password
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "LoginApp",
        link: 'https://fascinating-mooncake-88f043.netlify.app'
    }
})

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : "",
}
*/
export const registerMail = async (options) => {
    const { emailAdd, subject, msg } = req.body;

    // body of the email
    var email = {
        body: {
            name: username,
            intro: text || 'Welcome to Daily Tuition! We\'re very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from: process.env.SMPT_MAIL,
        to: emailAdd,
        subject: subject || "Signup Successful",
        html: emailBody
    }

    // send mail
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg: "You should receive an email from us." })
        })
        .catch(error => res.status(500).send({ error }))

}