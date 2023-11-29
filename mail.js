import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'saikumarmech12@gmail.com',
    pass: 'bdrijfdzsmlhhwpv'
  }
});

export const mailOptions = {
  from: 'saikumarmech12@gmail.com',
  to: 'saikumarmech12@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};