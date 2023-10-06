import nodemailer from "nodemailer";

import { SENDER_EMAIL, SMTP_PASS, SMTP_USER } from "../config.js";

function sendMail(email, subject, body) {
  var transport = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const message = {
    from: SENDER_EMAIL,
    to: email,
    subject,
    html: body,
  };

  return transport.sendMail(message);
}

export default sendMail