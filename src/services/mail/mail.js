import nodemailer from "nodemailer";
import config from "../../config/config.js";
const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.email,
    pass: config.emailPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default async (to, subject, html, attachments) => {
  try {
    const result = await transport.sendMail({
      from: config.emailMask,
      to: to,
      subject,
      html,
      attachments,
    });
    if (!result) throw new Error("Error sending email!");
    console.info(result);
    return result;
  } catch (error) {
    console.error(error.message);
    return error;
  }
};
