require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const util = require('util');
const logFile = fs.createWriteStream('email-log.txt', { flags: 'w' });
const logStdout = process.stdout;

console.log = function(d) { // Overwrite log
  logFile.write(util.format(d) + '\n');
  logStdout.write(util.format(d) + '\n');
};
console.error = console.log;

async function testEmail() {
  console.log('--- Email Configuration Debug ---');
  // ... (rest of the code)
  console.log('Host:', process.env.EMAIL_HOST);
  console.log('Port:', process.env.EMAIL_PORT);
  console.log('User:', process.env.EMAIL_USER);
  console.log('Pass:', process.env.EMAIL_PASS ? '**** (Set)' : 'Not Set');
  console.log('---------------------------------');

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true, // Enable debug output
    logger: true  // Log information to console
  });

  try {
    console.log('Attempting to verify connection...');
    await transporter.verify();
    console.log('✅ Connection verification successful!');

    console.log(`Attempting to send test email to ${process.env.EMAIL_USER}...`);
    const info = await transporter.sendMail({
      from: `"Test Admin" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self
      subject: 'Test Email from Admin Panel',
      text: 'If you receive this, email configuration is working correctly!',
    });

    console.log('✅ Message sent: %s', info.messageId);
  } catch (error) {
    console.error('❌ Error occurred:');
    console.error(error);
  }
}

testEmail();
