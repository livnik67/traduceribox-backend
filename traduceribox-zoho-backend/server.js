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

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.eu',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'office@traduceribox.ro',
      subject: `Noua comanda TraduceriBox de la ${name}`,
      text: `Detalii comanda:\nNume: ${name}\nEmail: ${email}\nMesaj: ${message}`,
      attachments: file
        ? [{ filename: file.originalname, path: file.path }]
        : [],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email trimis cu succes!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Eroare la trimiterea emailului." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serverul ruleaza pe portul ${PORT}`));