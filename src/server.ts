import express from 'express';
import { EmailService } from './EmailService';

const app = express();
app.use(express.json());

const emailService = new EmailService();

app.post('/send-email', async (req, res) => {
  const email = req.body;
  try {
    await emailService.send(email);
    res.status(200).json({ message: 'Email sent or queued' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.get('/status-log', (req, res) => {
  res.json(emailService.getStatusLog());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
