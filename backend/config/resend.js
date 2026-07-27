import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_to_prevent_crash");
export default resend;