--> Resilient Email Service <--

A fault-tolerant and modular email sending service built using TypeScript and Node.js, featuring retry logic, fallback mechanisms, idempotency, rate limiting, circuit breaker, and status logging.

This project is designed with clean code, SOLID principles, and comprehensive unit testing to ensure scalability and reliability.

--Features Overview--

 Feature                    Description


-Retry Logic                Retries failed requests with exponential backoff.

-Fallback Mechanism         Switches to secondary provider if the primary fails.

-Idempotency                Prevents duplicate email sends using unique email IDs.

-Rate Limiting              Limits number of email sends per minute (default: 5).

-Circuit Breaker            Opens the circuit after consecutive failures and auto-resets after a timeout.

-Status Tracking            Logs the email lifecycle statuses (SENT, FAILED, RETRYING, etc.).

-In-Memory Queue            Queues emails when rate limited or circuit is open.

-Logging                    Simple console-based logging.


--Project Structure--

resilient-email-service/
├── src/
│   ├── EmailService.ts       # Core logic for handling emails
│   ├── MockProviders.ts      # Mocked ProviderA and ProviderB
│   ├── Logger.ts             # Console-based logger
│   ├── utils.ts              # Sleep utility for backoff
│   └── server.ts             # Express server with REST APIs
├── test/
│   └── EmailService.test.ts  # Unit tests using Jest
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Documentation (this file)

--Getting Started--

1. Clone the Repository

   git clone https://github.com/saitejapuppala7/resilient-email-service.git
   cd resilient-email-service

2. Install Dependencies

   npm install

3. Build the Project

   npm run build

4. Start the Server

Development (TypeScript):

   npx ts-node src/server.ts

Production (JS):

   npm start

--API Endpoints--

POST /send-email

Send an email with required details.

Request Body:
{
  "id": "email-001",
  "to": "user@example.com",
  "subject": "Welcome",
  "body": "Thank you for signing up!"
}

Success Response:
{
  "message": "Email sent or queued"
}

Error Response:
{
  "error": "Failed to send email"
}

GET /status-log

Returns the status history of all email send attempts.

Sample Response:
[
  {
    "emailId": "email-001",
    "status": "SENT",
    "provider": "ProviderA",
    "timestamp": "2025-07-10T09:00:00.000Z"
  },
  ...
]

--Unit Testing--

Run all tests using:

 npm test

Includes test coverage for:
Email send success
Fallback provider behavior
Circuit breaker functionality
Rate limiting
Idempotent handling
Status logging


--Deployment--

The app is deployed on Render:

Live URL:
https://resilient-email-service-0qu1.onrender.com

You can use Postman, curl, or any HTTP client to test endpoints.

---Assumptions---

Email ID is assumed to be globally unique (for idempotency).
Providers are mocked; no real emails are sent.
Logs and queues are in-memory (no persistent storage).
Rate limit and circuit breaker thresholds are hardcoded but adjustable in constructor.



 Author

Sai Teja Puppala 
saiteja.avengers@gmail.com

