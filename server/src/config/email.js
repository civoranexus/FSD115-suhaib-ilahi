import { createTransport } from "nodemailer";
import logger from "../utils/logger.js";

let transporter;

const initializeEmailTransporter = () => {
  try {
    transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection
    transporter.verify((error, success) => {
      if (error) {
        logger.error("Email transporter configuration error:", error);
      } else {
        logger.info("Email transporter configured successfully");
      }
    });

    return transporter;
  } catch (error) {
    logger.error("Email configuration failed:", error);
    throw error;
  }
};

const getEmailTransporter = () => {
  if (!transporter) {
    return initializeEmailTransporter();
  }
  return transporter;
};

const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    const emailTransporter = getEmailTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
      attachments,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    logger.info(`Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error("Email sending failed:", error);
    throw error;
  }
};

export default {
  initializeEmailTransporter,
  getEmailTransporter,
  sendEmail,
};
