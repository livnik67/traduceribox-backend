import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/api/send-email", upload.single("file"), async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const file = req.file;

    console.log("=== Comandă primită ===");
    console.log("De la:", name);
    console.log("Email client:", email);
    console.log("Mesaj:", message);
    if (file) {
      console.log("Fișier încărcat:", file.originalname);
    } else {
      console.log("Niciun fișier atașat.");
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.eu',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("⏳ Încerc conectarea la SMTP Zoho...");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'office@traduceribox.ro',
      subject: `Noua comanda TraduceriBox de la ${name}`,
      text: `Detalii comanda:\nNume: ${name}\nEmail: ${email}\nMesaj: ${message}`,
      attachments: file
        ? [{ filename: file.originalname, path: file.path }]
        : [],
    };

    console.log("📤 Trimit email către:", mailOptions.to);

    await transporter.sendMail(mailOptions);

    console.log("✅ Email trimis cu succes!");
    res.status(200).json({ message: "Email trimis cu succes!" });
  } catch (error) {
    console.error("❌ Eroare SMTP:", error);
    res.status(500).json({ message: "Eroare la trimiterea emailului." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serverul ruleaza pe portul ${PORT}`));