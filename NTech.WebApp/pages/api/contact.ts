import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_USER,
      pass: process.env.NEXT_PUBLIC_EMAIL_APP_PASS,
    },
  });

  transporter.verify((error) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Error connecting to email service" });
    } else {
      console.log("Ready to Send");
    }
  });

  const { firstName, lastName, email, message, phone } = req.body;

  const fullName =
    firstName && lastName ? `${firstName} ${lastName}` : "Unknown";

  // Read HTML template file
  const templatePath = path.join(__dirname, "/public/index.html");
  const htmlTemplate = fs.readFileSync(templatePath, "utf-8");

  const mailOptions = {
    from: `NJMTech NoReply <${process.env.NEXT_PUBLIC_EMAIL_USER}>`,
    to: process.env.NEXT_PUBLIC_EMAIL_MAIL,
    subject: "Contact form submission - Portfolio",
    html: htmlTemplate
      .replace("{{name}}", fullName)
      .replace("{{email}}", email)
      .replace("{{message}}", message)
      .replace("{{phone}}", phone),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Error sending email" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Email sent successfully" });
    }
  });
}
