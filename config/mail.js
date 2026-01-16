const nodemailer = require('nodemailer');

/**
 * Email Configuration using Nodemailer
 * Used for sending OTP and password reset emails
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send OTP Email
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit OTP
 */
const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Admin Panel" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">Password Reset Request</h2>
          <p style="color: #666; font-size: 16px;">You have requested to reset your password. Please use the following OTP:</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #4F46E5; font-size: 36px; margin: 0; letter-spacing: 8px;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">This OTP will expire in <strong>${process.env.OTP_EXPIRY_MINUTES} minutes</strong>.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Email sending error: ${error.message}`);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = { sendOTPEmail };
