const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

const transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "smtp.gmail.com", // or your SMTP provider
    // port: 587,
    // secure: false,
    auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS  // app password
    }
});

transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP connection error:", error.message);
    } else {
      console.log("SMTP server is ready to send emails!");
    }
});

async function renderTemplate(template, data) {
    const filePath = path.join(__dirname, "../views/emails", `${template}.ejs`);
    return ejs.renderFile(filePath, data);
}
  

exports.sendEmail = async (to, subject, template, context) => {
    const html = await renderTemplate(template, context);

    return transporter.sendMail({
        from: `"MyApp" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}
