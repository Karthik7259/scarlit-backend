import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'karthik172180@gmail.com',
    pass: 'bauh szgu qzeq hdoz'
  }
});

let mailOptions = {
  from: 'karthik172180@gmail.com',
  to: 'mohankartik.cs23@rvce.edu.in',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
