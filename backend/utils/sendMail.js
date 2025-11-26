import nodemailer from 'nodemailer';

// Create a transporter using SMTP settings
export const sendEmail =  async ({email, subject, html}) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    // Send the email
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject,
        html,
    });
};