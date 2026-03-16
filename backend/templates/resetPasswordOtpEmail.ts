export function resetPasswordOtpTemplate(otp: string): string {
  return `
 <!DOCTYPE html>
 <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Reset Password OTP</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000; color: #fff;">
    <div style="max-width: 600px; margin: auto; padding: 40px 20px;">
        <h1 style="color: #cbfe33; text-align: center;">Reset Password OTP</h1>
        <p style="font-size: 16px;">
        Hello, <br><br>
        We received a request to reset your password. Use the OTP below to continue.
        If you didn't make this request, you can ignore this email.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background-color: #cbfe33; color: #000; padding: 12px 24px; border-radius: 6px; letter-spacing: 4px; font-size: 22px; font-weight: bold;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #ccc;">
        This OTP is valid for a limited time. Do not share it with anyone.
        </p>

        <hr style="border: none; border-top: 1px solid #333; margin: 40px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">
        &copy; ${new Date().getFullYear()} SaveIt. All rights reserved.
        </p>
    </div>
</body>
</html>
  `;
}
