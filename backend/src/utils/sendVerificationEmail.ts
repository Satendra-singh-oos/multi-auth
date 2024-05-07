//import SibApiV3Sdk from "@getbrevo/brevo";
const SibApiV3Sdk = require("@getbrevo/brevo");
import fs from "fs";

// interface Otp_Var {
//   OTP_CODE: string;
//   USERNAME: string;
//   [key: string]: string;
// }

function renderEmailTemplate(
  name: string,
  vars: any,
  folder = "email-templates"
) {
  let html = fs.readFileSync(`${__dirname}/${folder}/${name}.html`, "utf8");

  const keys = Object.keys(vars);
  keys.forEach((key) => {
    const reg = new RegExp(`{{${key}}}`, "g");
    html = html.replace(reg, vars[key]);
  });
  return html;
}

export const sendVerificationEmail = async (
  email: string,
  username: string,
  otp: string
) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BRAVO_API_KEY as string
    );

    const varsToReplace = {
      OTP_CODE: otp,
      USERNAME: username,
    };
    const otpEmailHtml = renderEmailTemplate(
      "otp_email",
      varsToReplace,
      "email-templates"
    );

    const sendSmtpEmail = {
      sender: {
        name: "multi-auth",
        email: process.env.SENDER_EMAIL as string,
      },
      to: [
        {
          email: email,
        },
      ],
      subject: "Multi-Auth | Verification Code",
      htmlContent: otpEmailHtml,
    };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    return response;
  } catch (error: any) {
    return { success: true, message: error?.message };
  }
};
