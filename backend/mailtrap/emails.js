import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplate.js';
import { mailtrapClient, sender } from './mailtrap.config.js';

export const sendVerificationEmail = async (email, verificationToken) => {

  const recipient = [{email}];

  try {
    const response = await mailtrapClient.send({
      from:sender,
      to:recipient,
      subject:"Verify your email",
      html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category:"Email Verification"
    })

    console.log("Email sent successfully", response)
  } catch (error) {
    console.error(`Error sending verificatioin`,error);
    throw new Error(`Error sending verification email: ${error}`)
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{email}];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "2ce4fc77-5e74-48d4-8699-ff03c8d27bff",
      template_variables: {
        "company_info_name": "Re-think",
        "name": "name"
      }
    })

    console.log("Welcome email sent successfully", response);

  } catch (error) {
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error}`);
  }
};