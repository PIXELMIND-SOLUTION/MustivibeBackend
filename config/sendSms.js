import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSms = async (to, message) => {
  const sms = await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: to.startsWith("+") ? to : `+91${to}`
  });

  return sms;
};
