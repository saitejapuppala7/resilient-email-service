"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const MockProviders_1 = require("./MockProviders");
const utils_1 = require("./utils");
const Logger_1 = require("./Logger");
class EmailService {
    constructor(rateLimitPerMinute = 5) {
        this.failureCount = 0;
        this.circuitBreakerThreshold = 5;
        this.circuitBreakerOpen = false;
        this.circuitBreakerResetTime = 30000;
        this.lastFailureTime = 0;
        this.providerA = new MockProviders_1.MockProviderA();
        this.providerB = new MockProviders_1.MockProviderB();
        this.rateLimit = rateLimitPerMinute;
        this.sentEmails = new Set();
        this.queue = [];
        this.statusLog = [];
        this.lastSentTimestamps = [];
        this.logger = new Logger_1.Logger();
    }
    send(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.sentEmails.has(email.id)) {
                this.logStatus(email.id, 'IDEMPOTENT_SKIP', 'IDEMPOTENT_SKIP');
                return;
            }
            if (this.circuitBreakerOpen) {
                const now = Date.now();
                if (now - this.lastFailureTime < this.circuitBreakerResetTime) {
                    this.logStatus(email.id, 'CIRCUIT_BREAKER', 'REJECTED');
                    this.queue.push(email);
                    return;
                }
                else {
                    this.circuitBreakerOpen = false;
                    this.failureCount = 0;
                }
            }
            if (!this.isRateLimited()) {
                this.markTimestamp();
                try {
                    yield this.sendWithRetry(email);
                    this.sentEmails.add(email.id);
                    this.failureCount = 0;
                }
                catch (err) {
                    this.failureCount++;
                    this.lastFailureTime = Date.now();
                    if (this.failureCount >= this.circuitBreakerThreshold) {
                        this.circuitBreakerOpen = true;
                    }
                    this.logStatus(email.id, 'FAILED', 'FALLBACK_FAILED');
                    this.queue.push(email);
                    this.logStatus(email.id, 'QUEUED', 'QUEUE');
                }
            }
            else {
                this.queue.push(email);
                this.logStatus(email.id, 'QUEUED', 'RATELIMIT');
            }
        });
    }
    sendWithRetry(email_1) {
        return __awaiter(this, arguments, void 0, function* (email, maxRetries = 3, delay = 1000) {
            let attempt = 0;
            while (attempt < maxRetries) {
                try {
                    yield this.providerA.send(email);
                    this.logStatus(email.id, 'SENT', this.providerA.name);
                    return;
                }
                catch (_a) {
                    try {
                        yield this.providerB.send(email);
                        this.logStatus(email.id, 'SENT', this.providerB.name);
                        return;
                    }
                    catch (_b) {
                        this.logStatus(email.id, 'RETRYING', `Attempt ${attempt + 1}`);
                        yield (0, utils_1.sleep)(delay * Math.pow(2, attempt));
                        attempt++;
                    }
                }
            }
            throw new Error('All retries and fallbacks failed');
        });
    }
    isRateLimited() {
        const oneMinuteAgo = Date.now() - 60000;
        this.lastSentTimestamps = this.lastSentTimestamps.filter(ts => ts > oneMinuteAgo);
        return this.lastSentTimestamps.length >= this.rateLimit;
    }
    markTimestamp() {
        this.lastSentTimestamps.push(Date.now());
    }
    logStatus(emailId, status, provider) {
        const entry = { emailId, status, provider, timestamp: new Date() };
        this.statusLog.push(entry);
        this.logger.log(entry);
    }
    processQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            const processing = [...this.queue];
            this.queue = [];
            for (const email of processing) {
                yield this.send(email);
            }
        });
    }
    getStatusLog() {
        return this.statusLog;
    }
}
exports.EmailService = EmailService;
