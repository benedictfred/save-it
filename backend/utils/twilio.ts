import twilio from "twilio";

export function sendSMS(to: string, code: string) {
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

  return client.messages.create({
    to,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: `Your SaveIt Bank verification code is: ${code}. Valid for 10 minutes.`,
  });
}
