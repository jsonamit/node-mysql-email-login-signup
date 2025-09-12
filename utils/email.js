const nodemailer = require("nodemailer");

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
  

exports.sendEmail = async (to, subject, html) => {
  return transporter.sendMail({
    from: `"MyApp" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}
