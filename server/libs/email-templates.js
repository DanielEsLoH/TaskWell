// Email template functions for professional, consistent email design

const baseEmailTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TaskWell</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 0; text-align: center; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                TaskWell
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                Project Management Made Simple
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px;">
                This email was sent by TaskWell
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                If you didn't request this email, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const buttonStyle = `
  display: inline-block;
  padding: 14px 32px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  margin: 20px 0;
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
`;

export const emailVerificationTemplate = (verificationLink, userName) => {
  const content = `
    <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px; font-weight: 700;">
      Verify Your Email Address
    </h2>
    <p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hi${userName ? ` ${userName}` : ''},
    </p>
    <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Welcome to TaskWell! To complete your registration and start managing your projects, please verify your email address by clicking the button below:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationLink}" style="${buttonStyle}">
        Verify Email Address
      </a>
    </div>
    <p style="margin: 24px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      Or copy and paste this link into your browser:
    </p>
    <p style="margin: 8px 0 0; padding: 12px; background-color: #f3f4f6; border-radius: 6px; word-break: break-all; color: #2563eb; font-size: 13px; font-family: monospace;">
      ${verificationLink}
    </p>
    <p style="margin: 24px 0 0; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; color: #92400e; font-size: 14px; line-height: 1.6;">
      <strong>⏱️ This link will expire in 1 hour.</strong>
    </p>
  `;
  return baseEmailTemplate(content);
};

export const passwordResetTemplate = (resetLink, userName) => {
  const content = `
    <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px; font-weight: 700;">
      Reset Your Password
    </h2>
    <p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hi${userName ? ` ${userName}` : ''},
    </p>
    <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
      We received a request to reset your password for your TaskWell account. Click the button below to create a new password:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" style="${buttonStyle}">
        Reset Password
      </a>
    </div>
    <p style="margin: 24px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      Or copy and paste this link into your browser:
    </p>
    <p style="margin: 8px 0 0; padding: 12px; background-color: #f3f4f6; border-radius: 6px; word-break: break-all; color: #2563eb; font-size: 13px; font-family: monospace;">
      ${resetLink}
    </p>
    <p style="margin: 24px 0 0; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; color: #92400e; font-size: 14px; line-height: 1.6;">
      <strong>⏱️ This link will expire in 15 minutes.</strong>
    </p>
    <p style="margin: 24px 0 0; padding: 16px; background-color: #fee2e2; border-left: 4px solid #ef4444; border-radius: 6px; color: #991b1b; font-size: 14px; line-height: 1.6;">
      <strong>🔒 Security Notice:</strong> If you didn't request a password reset, please ignore this email or contact support if you have concerns.
    </p>
  `;
  return baseEmailTemplate(content);
};

export const workspaceInvitationTemplate = (workspaceName, invitationLink, inviterName) => {
  const content = `
    <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px; font-weight: 700;">
      You've Been Invited!
    </h2>
    <p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hello,
    </p>
    <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
      ${inviterName ? `<strong>${inviterName}</strong> has` : 'You have been'} invited you to join the <strong style="color: #2563eb;">${workspaceName}</strong> workspace on TaskWell.
    </p>
    <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 20px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #2563eb;">
      <p style="margin: 0; color: #1e40af; font-size: 15px; line-height: 1.6;">
        <strong>✨ Collaborate together</strong><br>
        Join your team to manage projects, track tasks, and achieve goals together.
      </p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${invitationLink}" style="${buttonStyle}">
        Accept Invitation
      </a>
    </div>
    <p style="margin: 24px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      Or copy and paste this link into your browser:
    </p>
    <p style="margin: 8px 0 0; padding: 12px; background-color: #f3f4f6; border-radius: 6px; word-break: break-all; color: #2563eb; font-size: 13px; font-family: monospace;">
      ${invitationLink}
    </p>
    <p style="margin: 24px 0 0; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; color: #92400e; font-size: 14px; line-height: 1.6;">
      <strong>⏱️ This invitation will expire in 7 days.</strong>
    </p>
  `;
  return baseEmailTemplate(content);
};
