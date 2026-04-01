const { transporter, sendEmail } = require('../config/nodemailer');

const verifyConnection = async () => {
  if (!transporter) {
    throw new Error('Email transporter is not configured. Check your SMTP settings.');
  }

  return new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email transporter verification failed:', error.message);
        return reject(error);
      }
      console.log('✅ Email transporter verified successfully.');
      resolve(success);
    });
  });
};

const sendReminder = async ({ to, subject, text, html, from }) => {
  return sendEmail({ to, subject, text, html, from });
};

module.exports = {
  verifyConnection,
  sendReminder,
};
