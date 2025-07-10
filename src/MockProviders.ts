import { Email } from './EmailService';

export interface EmailProvider {
  name: string;
  send(email: Email): Promise<void>;
}

export class MockProviderA implements EmailProvider {
  name = 'ProviderA';

  async send(email: Email): Promise<void> {
    if (Math.random() < 0.7) return; // 70% chance to succeed
    throw new Error('ProviderA failed');
  }
}

export class MockProviderB implements EmailProvider {
  name = 'ProviderB';

  async send(email: Email): Promise<void> {
    if (Math.random() < 0.8) return; // 80% chance to succeed
    throw new Error('ProviderB failed');
  }
}
