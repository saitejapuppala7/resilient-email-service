
import { MockProviderA, MockProviderB, EmailProvider } from './MockProviders';
import { sleep } from './utils';
import { Logger } from './Logger';

export interface Email {
  id: string;
  to: string;
  subject: string;
  body: string;
}

export interface StatusEntry {
  emailId: string;
 status: 'SENT' | 'FAILED' | 'RETRYING' | 'QUEUED' | 'CIRCUIT_BREAKER' | 'IDEMPOTENT_SKIP';
  provider: string;
  timestamp: Date;
}

export class EmailService {
  private providerA: EmailProvider;
  private providerB: EmailProvider;
  private rateLimit: number;
  private sentEmails: Set<string>;
  private queue: Email[];
  private statusLog: StatusEntry[];
  private lastSentTimestamps: number[];
  private logger: Logger;

  private failureCount: number = 0;
  private circuitBreakerThreshold: number = 5;
  private circuitBreakerOpen: boolean = false;
  private circuitBreakerResetTime: number = 30000;
  private lastFailureTime: number = 0;

  constructor(rateLimitPerMinute = 5) {
    this.providerA = new MockProviderA();
    this.providerB = new MockProviderB();
    this.rateLimit = rateLimitPerMinute;
    this.sentEmails = new Set();
    this.queue = [];
    this.statusLog = [];
    this.lastSentTimestamps = [];
    this.logger = new Logger();
  }

  async send(email: Email): Promise<void> {
    if (this.sentEmails.has(email.id)) {
      this.logStatus(email.id, 'IDEMPOTENT_SKIP' as any, 'IDEMPOTENT_SKIP');
      return;
    }

    if (this.circuitBreakerOpen) {
      const now = Date.now();
      if (now - this.lastFailureTime < this.circuitBreakerResetTime) {
        this.logStatus(email.id, 'CIRCUIT_BREAKER', 'REJECTED');
        this.queue.push(email);
        return;
      } else {
        this.circuitBreakerOpen = false;
        this.failureCount = 0;
      }
    }

    if (!this.isRateLimited()) {
      this.markTimestamp();
      try {
        await this.sendWithRetry(email);
        this.sentEmails.add(email.id);
        this.failureCount = 0;
      } catch (err) {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        if (this.failureCount >= this.circuitBreakerThreshold) {
          this.circuitBreakerOpen = true;
        }
        this.logStatus(email.id, 'FAILED', 'FALLBACK_FAILED');
        this.queue.push(email);
        this.logStatus(email.id, 'QUEUED', 'QUEUE');
      }
    } else {
      this.queue.push(email);
      this.logStatus(email.id, 'QUEUED', 'RATELIMIT');
    }
  }

  private async sendWithRetry(email: Email, maxRetries = 3, delay = 1000): Promise<void> {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        await this.providerA.send(email);
        this.logStatus(email.id, 'SENT', this.providerA.name);
        return;
      } catch {
        try {
          await this.providerB.send(email);
          this.logStatus(email.id, 'SENT', this.providerB.name);
          return;
        } catch {
          this.logStatus(email.id, 'RETRYING', `Attempt ${attempt + 1}`);
          await sleep(delay * Math.pow(2, attempt));
          attempt++;
        }
      }
    }
    throw new Error('All retries and fallbacks failed');
  }

  private isRateLimited(): boolean {
    const oneMinuteAgo = Date.now() - 60000;
    this.lastSentTimestamps = this.lastSentTimestamps.filter(ts => ts > oneMinuteAgo);
    return this.lastSentTimestamps.length >= this.rateLimit;
  }

  private markTimestamp(): void {
    this.lastSentTimestamps.push(Date.now());
  }

  private logStatus(emailId: string, status: StatusEntry['status'], provider: string): void {
    const entry = { emailId, status, provider, timestamp: new Date() };
    this.statusLog.push(entry);
    this.logger.log(entry);
  }

  async processQueue(): Promise<void> {
  const processing = [...this.queue];
  this.queue = [];
  for (const email of processing) {
    await this.send(email); 
  }
}


  getStatusLog(): StatusEntry[] {
    return this.statusLog;
  }
}