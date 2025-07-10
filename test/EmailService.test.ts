jest.mock('../src/utils', () => ({
  sleep: () => Promise.resolve()
}));

import { EmailService } from '../src/EmailService';
import { jest } from '@jest/globals';

const email = (id: string) => ({
  id,
  to: 'test@example.com',
  subject: 'Test',
  body: 'This is a test email.'
});

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(() => {
    service = new EmailService(3); 
  });

  test('should send email successfully', async () => {
    const testEmail = email('e1');
    await service.send(testEmail);
    const logs = service.getStatusLog();
    expect(logs.some(log => log.emailId === 'e1' && log.status === 'SENT')).toBeTruthy();
  });

  test('should avoid duplicate sends (idempotency)', async () => {
    const testEmail = email('e2');
    await service.send(testEmail);
    await service.send(testEmail);
    const logs = service.getStatusLog().filter(log => log.emailId === 'e2' && log.status === 'SENT');
    expect(logs.length).toBe(1);
  });

  test('should fall back to second provider on failure', async () => {
    jest.spyOn(service['providerA'], 'send').mockImplementation(() => Promise.reject('fail'));
    const testEmail = email('e3');
    await service.send(testEmail);
    const logs = service.getStatusLog();
    expect(logs.some(log => log.emailId === 'e3' && log.provider === 'ProviderB')).toBeTruthy();
  });

  test('should activate circuit breaker on repeated failures', async () => {
    
    service = new EmailService(Infinity); 

    
    jest.spyOn(service['providerA'], 'send').mockImplementation(() => Promise.reject('fail'));
    jest.spyOn(service['providerB'], 'send').mockImplementation(() => Promise.reject('fail'));

    
    for (let i = 0; i < 5; i++) {
      try {
        await service.send(email(`fail-${i}`));
      } catch {}
    }

    
    const cbEmail = email('circuit-break');
    await service.send(cbEmail);

    const logs = service.getStatusLog();
    console.log('CB logs:', logs.filter(log => log.emailId === 'circuit-break'));
    expect(logs.some(log => log.emailId === 'circuit-break' && log.status === 'CIRCUIT_BREAKER')).toBeTruthy();
  });

  test('should queue email when rate limit exceeded', async () => {
    await service.send(email('q1'));
    await service.send(email('q2'));
    await service.send(email('q3'));
    await service.send(email('q4')); 
    const logs = service.getStatusLog();
    expect(logs.some(log => log.emailId === 'q4' && log.status === 'QUEUED')).toBeTruthy();
  });
});
