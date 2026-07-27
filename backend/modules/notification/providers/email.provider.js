import resend from "../../../config/resend.js";

export const sendEmail = async ({to, subject, html, from = process.env.EMAIL_FROM}) => {
    return resend.emails.send({from,to,subject,html});
};