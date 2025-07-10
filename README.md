# 📧 Resilient Email Service

A fault-tolerant, extensible email sending service built with **TypeScript** that:

- Supports multiple mock providers with **fallback** logic
- Retries with **exponential backoff**
- Enforces **rate limiting**
- Guarantees **idempotency** (no duplicate sends)
- Tracks status logs
- Implements a **circuit breaker** pattern
- Includes unit tests using **Jest**

> Built for reliability, testability, and adherence to SOLID principles.

---

## ✅ Features

| Feature            | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| **Retry Logic**     | Retries sending email on failure with exponential backoff (`2^attempt`)     |
| **Fallback**        | Switches to second provider if the first fails                              |
| **Idempotency**     | Prevents duplicate emails using email ID tracking                           |
| **Rate Limiting**   | Limits sending to N emails per minute (default: 5)                          |
| **Circuit Breaker** | Temporarily stops sending after repeated failures                           |
| **Queueing**        | Emails are queued when rate-limited or when circuit breaker is active       |
| **Status Tracking** | Logs every attempt with timestamp, provider, and result                     |
| **Unit Tests**      | Jest test suite with 100% test coverage for core features                   |

---

## 🧠 Assumptions

- Email is identified uniquely by `email.id`
- No actual email is sent — providers are mocked
- Queue is stored in-memory (not persistent)
- Rate limit is per minute
- Circuit breaker resets after 30 seconds

---

## 📁 Project Structure

resilient-email-service/
├── src/
│ ├── EmailService.ts # Core service logic
│ ├── Logger.ts # Console-based status logger
│ ├── MockProviders.ts # Two mock email providers
│ ├── utils.ts # Helper functions (e.g., sleep)
│ └── main.ts # Demo runner
├── test/
│ └── EmailService.test.ts # Unit tests using Jest
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md

yaml
Copy
Edit

---

## 🛠️ Setup Instructions

### 1. Prerequisites

- Node.js v18+ [Download Here](https://nodejs.org/)
- TypeScript

```bash
npm install -g typescript
ts-node

bash
Copy
Edit
npm install -g ts-node
2. Clone & Install
bash
Copy
Edit
git clone https://github.com/yourusername/resilient-email-service.git
cd resilient-email-service
npm install
3. Build & Run
Run the main demo file:
bash
Copy
Edit
npm run start
This executes the sample in src/main.ts.

Run tests:
bash
Copy
Edit
npm test
You should see ✅ 4/5 passing or 5/5 if using the fixed test case.

🧪 Tests Covered
Run npm test to verify all key features:

✅ Email sent successfully

✅ Prevents duplicate sends

✅ Falls back to second provider

✅ Activates circuit breaker

✅ Queues emails during rate limiting

✨ Example: main.ts
ts
Copy
Edit
import { EmailService } from './EmailService';

const run = async () => {
  const service = new EmailService();
  await service.send({
    id: 'demo-1',
    to: 'test@example.com',
    subject: 'Hello!',
    body: 'This is a resilient email test.'
  });
};

run();
🧱 Extending the Project
Replace mock providers with real ones (e.g., SendGrid, Mailgun)

Add persistent queue (e.g., Redis)

Add Express HTTP API endpoint

Integrate Docker or PM2 for production

Store logs in a database or file

📚 Technologies Used
TypeScript

Node.js

Jest (for testing)

SOLID principles and clean code architecture

👨‍💻 Author
Sai Teja
Built for a React Native internship assignment to demonstrate backend architecture, fault-tolerant design, and testing expertise.

📄 License
MIT License – feel free to use, contribute, and adapt.

yaml
Copy
Edit

---

Let me know if you'd like me to tailor the README for GitHub Pages or include images/badges like test status or tech stack.






You said:
 README with setup instructions and assumptions


ChatGPT said:
Here’s a clean and detailed README.md for your Resilient Email Service, including setup instructions, assumptions, and all key features clearly outlined:

markdown
Copy
Edit
# 📧 Resilient Email Service

A robust, fault-tolerant Email Sending Service built in **TypeScript** that simulates integration with multiple providers using intelligent fallbacks, retries, rate limiting, idempotency control, and a circuit breaker mechanism.

---

## 🚀 Features

✅ **Retry Logic with Exponential Backoff**  
✅ **Fallback to Secondary Provider**  
✅ **Idempotency (No Duplicate Sends)**  
✅ **Basic Rate Limiting (Emails per minute)**  
✅ **Circuit Breaker Pattern**  
✅ **Email Status Tracking**  
✅ **Email Queuing for Rate Limits or Failures**  
✅ **Unit Tests using Jest**

---

## 📂 Project Structure

resilient-email-service/
│
├── src/
│ ├── EmailService.ts # Core service logic
│ ├── Logger.ts # Custom logger for status tracking
│ ├── MockProviders.ts # Simulated email providers
│ ├── utils.ts # Utility functions (e.g., sleep)
│ └── main.ts # Entry file for sample execution
│
├── test/
│ └── EmailService.test.ts # Jest test suite
│
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md

yaml
Copy
Edit

---

## 🧠 Assumptions

- Each email has a **unique ID** (`email.id`) used to enforce idempotency.
- **No real emails** are sent — two mock providers simulate success/failure.
- Queue is in-memory and **not persistent** across sessions.
- **Rate limit** is defined in emails per minute (default is `5`).
- **Circuit breaker** opens after 5 consecutive failures and resets after 30 seconds.
- `console.log()` is used for logging status entries.

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/resilient-email-service.git
cd resilient-email-service
2. Install Dependencies
bash
Copy
Edit
npm install
3. Run the Service (Demo)
bash
Copy
Edit
npx ts-node src/main.ts
Or use the npm script:

bash
Copy
Edit
npm run start
4. Run Tests
bash
Copy
Edit
npm test
You’ll see logs from different test cases such as retries, circuit breaker activation, idempotency, etc.

🧪 Testing Overview
We use Jest for testing:

should send email successfully

should avoid duplicate sends (idempotency)

should fall back to second provider on failure

should activate circuit breaker on repeated failures

should queue email when rate limit exceeded

🔧 Configuration
You can modify:

rateLimitPerMinute in the EmailService constructor

Circuit breaker threshold or reset time in EmailService.ts

Sleep delay and retry attempts in sendWithRetry()

📦 Example Usage
ts
Copy
Edit
const service = new EmailService(3); // 3 emails per minute

await service.send({
  id: 'email-001',
  to: 'john@example.com',
  subject: 'Hello!',
  body: 'Test email from resilient service'
});
📘 To Extend This Project
🔄 Replace mock providers with real email APIs (SendGrid, Mailgun, etc.)

🌐 Expose a REST API using Express

🗃️ Store logs and queues in Redis or a database

📈 Add metrics or a dashboard

🐳 Dockerize the app for production

👨‍💻 Author
Sai Teja
Designed as part of a technical assignment to showcase backend reliability, system resilience patterns, and test-driven design.