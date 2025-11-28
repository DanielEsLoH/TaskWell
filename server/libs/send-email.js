import * as brevo from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

// Initialize Brevo API
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const fromEmail = process.env.FROM_EMAIL;
const fromName = process.env.FROM_NAME || "TaskWell";

export const sendEmail = async (to, subject, html) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.sender = { name: fromName, email: fromEmail };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully via Brevo:", data.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email via Brevo:", error);
    return false;
  }
};
