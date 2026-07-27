export const verificationTemplate = ({name, verificationLink}) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
      <h2>Welcome to MedRemind 👋</h2>

      <p>Hello ${name},</p>

      <p>
        Thank you for creating your MedRemind account.
      </p>

      <p>
        Please verify your email by clicking the button below.
      </p>

      <a
        href="${verificationLink}"
        style="
          display:inline-block;
          padding:12px 24px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Verify Email
      </a>

      <p style="margin-top:20px;">
        This link will expire in 1 hour.
      </p>

      <p>
        If you didn't create this account, you can safely ignore this email.
      </p>
    </div>
  `;
};