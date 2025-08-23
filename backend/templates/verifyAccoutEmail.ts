export function verifyEmailTemplate(name: string, verifyEmailLink: string) {
  return `
    <!DOCTYPE html>
    <html>
     <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Email Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f9fafb;">
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #111;">Welcome to SaveIt Bank, ${name}!</h2>
        <p>Thanks for signing up. Please verify your email address to activate your account.</p>

        <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyEmailLink}" 
            style="background: #cbfe33; color: #111; text-decoration: none; 
              padding: 14px 28px; border-radius: 8px; font-size: 16px; 
              font-weight: bold; display: inline-block;">
            Verify Email
        </a>
        </div>

        <p>If you didn’t create this account, you can safely ignore this email.</p>
        </div>
    </body>
    </html>
 `;
}
