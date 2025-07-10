"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    log(entry) {
        console.log(`[${entry.timestamp.toISOString()}] [${entry.status}] [${entry.provider}] Email ID: ${entry.emailId}`);
    }
}
exports.Logger = Logger;
