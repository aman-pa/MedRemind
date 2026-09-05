export const resetPasswordTemplate = ({ name, resetPasswordLink }) => {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #333;">
      
      <h2 style="color: #2563eb;">Reset Your MedRemind Password</h2>

      <p>Hi ${name},</p>

      <p>
        We received a request to reset the password for your MedRemind account.
      </p>

      <p>
        Click the button below to create a new password. This link will expire in
        <strong>1 hour</strong>.
      </p>

      <div style="margin: 32px 0;">
        <a
          href="${resetPasswordLink}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          "
        >
          Reset Password
        </a>
      </div>

      <p>
        If the button doesn't work, copy and paste the following link into your
        browser:
      </p>

      <p style="word-break: break-all; color: #2563eb;">
        ${resetPasswordLink}
      </p>

      <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;" />

      <p>
        If you didn't request a password reset, you can safely ignore this email.
        Your password will remain unchanged.
      </p>

      <p>
        For your security, never share this link with anyone.
      </p>

      <p style="margin-top: 32px;">
        Thanks,<br />
        <strong>MedRemind Team</strong>
      </p>

    </div>
  `;
};