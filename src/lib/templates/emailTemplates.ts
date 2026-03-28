export const getVerificationEmailTemplate = (url: string) => `
  <div style="font-family: 'Inter', Arial, sans-serif; background-color: #f6f8fb; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <h2 style="color: #1a1a2e; margin-bottom: 20px; font-size: 24px;">Welcome to Coin App! 🚀</h2>
      <p style="color: #4a4a68; line-height: 1.6; font-size: 16px;">
        You're one step away from joining the next generation of enterprise crypto trading. Please verify your email address to secure your account and unlock all features.
      </p>
      <div style="text-align: center; margin: 40px 0;">
        <a href="${url}" style="display: inline-block; padding: 14px 32px; background-color: #7B68EE; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 14px rgba(123, 104, 238, 0.4);">
          Verify Identity
        </a>
      </div>
      <p style="color: #718096; font-size: 14px; text-align: center;">If you didn't create this account, you can safely ignore this email.</p>
    </div>
  </div>
`;

export const getResetPasswordEmailTemplate = (url: string) => `
  <div style="font-family: 'Inter', Arial, sans-serif; background-color: #f6f8fb; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <h2 style="color: #1a1a2e; margin-bottom: 20px; font-size: 24px;">Password Reset Request 🔐</h2>
      <p style="color: #4a4a68; line-height: 1.6; font-size: 16px;">
        We received a request to reset your password. Click the secure link below to set up a new one. This link will expire in 1 hour.
      </p>
      <div style="text-align: center; margin: 40px 0;">
        <a href="${url}" style="display: inline-block; padding: 14px 32px; background-color: #E53E3E; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 14px rgba(229, 62, 62, 0.4);">
          Reset Password
        </a>
      </div>
      <p style="color: #718096; font-size: 14px; text-align: center;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
    </div>
  </div>
`;
