import { EmailService } from './EmailService';

const run = async () => {
  const service = new EmailService();

  await service.send({
    id: 'demo-1',
    to: 'user@example.com',
    subject: 'Welcome!',
    body: 'This is a test email from our resilient service.'
  });

  service.processQueue();
};

run();
