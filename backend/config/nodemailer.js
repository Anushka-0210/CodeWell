const nodemailer = require('nodemailer');

const emailService = process.env.EMAIL_SERVICE;
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587;
const emailSecure = process.env.EMAIL_SECURE === 'true';
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailFrom = process.env.EMAIL_FROM || emailUser;

const hasSmtpConfig = Boolean(emailHost && emailUser && emailPass);
const hasServiceConfig = Boolean(emailService && emailUser && emailPass);

if (!hasSmtpConfig && !hasServiceConfig) {
  console.warn(
    '⚠️  Email configuration is incomplete. Set EMAIL_HOST/EMAIL_SERVICE, EMAIL_USER, and EMAIL_PASS in your environment.'
  );
}

const transportOptions = hasServiceConfig
  ? {
      service: emailService,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    }
  : {
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: hasSmtpConfig
        ? {
            user: emailUser,
            pass: emailPass,
          }
        : undefined,
    };

const transporter = nodemailer.createTransport(transportOptions);

if (hasSmtpConfig || hasServiceConfig) {
  transporter.verify((error) => {
    if (error) {
      console.error('❌ Nodemailer verification failed:', error.message);
    } else {
      console.log('✅ Nodemailer transporter is ready to send emails.');
    }
  });
} else {
  console.log('ℹ️  Nodemailer verification skipped because email env vars are not fully configured.');
}

const sendEmail = async ({ to, subject, text, html, from }) => {
  if (!emailUser || !emailPass) {
    throw new Error('Email credentials are not configured. Set EMAIL_USER and EMAIL_PASS in your environment.');
  }

  if (!to || !subject) {
    throw new Error('sendEmail requires both `to` and `subject` parameters.');
  }

  const mailOptions = {
    from: from || emailFrom,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  transporter,
  sendEmail,
};
