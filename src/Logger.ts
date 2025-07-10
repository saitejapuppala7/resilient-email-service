import { StatusEntry } from './EmailService';

export class Logger {
  log(entry: StatusEntry): void {
    console.log(`[${entry.timestamp.toISOString()}] [${entry.status}] [${entry.provider}] Email ID: ${entry.emailId}`);
  }
}
