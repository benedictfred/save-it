export function resetPasswordTemplate(resetLink: string): string {
  return `
 <!DOCTYPE html>
 <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000; color: #fff;">
    <div style="max-width: 600px; margin: auto; padding: 40px 20px;">
        <h1 style="color: #cbfe33; text-align: center;">Reset Your Password</h1>
        <p style="font-size: 16px;">
        Hello, <br><br>
        We received a request to reset your password. If you didn't make this request, you can ignore this email.
        </p>

        <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="display: inline-block; background-color: #cbfe33; color: #000; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Reset Password
        </a>
        </div>

        <p style="font-size: 14px; color: #ccc;">
        If you're having trouble clicking the button, copy and paste the URL below into your browser:
        <br>
        <a href="{{RESET_LINK}}" style="color: #cbfe33;">${resetLink}</a>
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
