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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EmailService_1 = require("./EmailService");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const emailService = new EmailService_1.EmailService();
app.post('/send-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body;
    try {
        yield emailService.send(email);
        res.status(200).json({ message: 'Email sent or queued' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to send email' });
    }
}));
app.get('/status-log', (req, res) => {
    res.json(emailService.getStatusLog());
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
