import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true", // true pour 465, false pour autres ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendEmail(to: string, subject: string, text: string) {
    try {
        await transporter.sendMail({
            from: `"App Meca" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
        });
        console.log("Email envoyé à", to);
    } catch (err) {
        console.error("Erreur en envoyant l'email:", err);
    }
}