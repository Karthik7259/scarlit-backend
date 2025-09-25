import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

// You can set these in your .env file for security
const GMAIL_USER = process.env.GMAIL_USER 
const GMAIL_PASS = process.env.GMAIL_PASS

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS
  }
});

const sendEmail = async ({ sendTo, subject, html }) => {
  const mailOptions = {
    from: GMAIL_USER,
    to: sendTo,
    subject: subject,
    html: html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;



