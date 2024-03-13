const nodemailer = require('nodemailer');


async function sendOTP(email, otp) {
    try {
        
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'agrahariprashant1@gmail.com',
                pass: 'yuhy rpzb fwcw tttm'
            }
        });

        
        let mailOptions = {
            from: 'agrahariprashant1@gmail.com',
            to: email,
            subject: 'Your Email Verification OTP',
            text: `<strong>Your OTP for email verification is ${otp}</strong>`
        };

      
        let info = await transporter.sendMail(mailOptions);

        console.log('Message sent: %s', info.messageId);
        return true; 
    } catch (error) {
        console.error('Error sending OTP:', error);
        return false; 
    }
}


 module.exports = {sendOTP}