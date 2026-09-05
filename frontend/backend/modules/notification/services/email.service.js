import { sendEmail } from "../providers/email.provider.js";
import { verificationTemplate } from "../templates/verification.template.js";
import { resetPasswordTemplate } from "../templates/resetPassword.template.js";

export const sendVerificationEmail = async ({user, token}) => {
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    
    const html = verificationTemplate({
        name: user.name,
        verificationLink
    });

    await sendEmail({
        to: user.email,
        subject: "Verify your MedRemind Account",
        html,
    });
};

export const sendResetPasswordEmail = async ({user, token}) => {
    const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    
    const html = resetPasswordTemplate({
        name: user.name,
        resetPasswordLink
    });
    
    await sendEmail({
        to: user.email,
        subject: "Reset your MedRemind account password",
        html,
    });  
};