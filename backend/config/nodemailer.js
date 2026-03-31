const nodemailer = require('nodemailer');

const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587;
const emailSecure = process.env.EMAIL_SECURE === 'true';
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailHost || !emailUser || !emailPass) {
  console.warn(
    '⚠️  Email reminder configuration is incomplete. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS in your environment.'
  );
}

const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: emailSecure,
  auth: emailHost && emailUser && emailPass ? {
    user: emailUser,
    pass: emailPass,
  } : undefined,
});

if (emailHost && emailUser && emailPass) {
  transporter.verify((error) => {
    if (error) {
      console.error('❌ Nodemailer verification failed:', error.message);
    } else {
      console.log('✅ Nodemailer transporter is ready to send emails.');
    }
  });
} else {
  console.log('ℹ️  Nodemailer verification skipped because SMTP env vars are not fully configured.');
}

module.exports = transporter;
