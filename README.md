README.md for Data Pusher Project

# Data Pusher API

## Overview

Data Pusher is a simple HTTP server built with raw Node.js and SQLite to manage accounts, destinations (webhooks), and forward incoming JSON data to configured destinations securely.

---

## Features

- **Account Management**

  - Create, read, update, delete accounts
  - Each account has a unique `app_secret_token` for authentication

- **Destination Management**

  - CRUD operations for destinations tied to an account
  - Destinations define URL, HTTP method, and optional headers

- **Data Forwarding**

  - Receive JSON data via a POST endpoint per account
  - Authenticate requests using `app_secret_token` header
  - Forward data to all configured destinations for the account

- **No external frameworks**
  - Uses raw Node.js HTTP server and SQLite database

---

## Setup

1. Clone the repo

2. Install dependencies

   ```bash
   npm install sqlite3
   ```

3. Initialize database (tables created in db.js on first run)
4. Start server bash CopyEdit   node server.js
5.
6. Server runs on http://localhost:3000 (configurable via PORT env variable)

API Endpoints
Accounts

- POST /accounts Create a new account Body: { "name": "Account Name" } Response includes generated id and app_secret_token
- GET /accounts/{account_id} Get account details
- PUT /accounts/{account_id} Update account (e.g. name) Body: { "name": "New Name" }
- DELETE /accounts/{account_id} Delete account

Destinations

- POST /accounts/{account_id}/destinations Create destination Body example: json CopyEdit   {
- "url": "https://example.com/webhook",
- "method": "POST",
- "headers": { "Authorization": "Bearer abc123" }
- }
-
- GET /accounts/{account_id}/destinations List all destinations for account
- GET /accounts/{account_id}/destinations/{destination_id} Get single destination details
- PUT /accounts/{account_id}/destinations/{destination_id} Update destination
- DELETE /accounts/{account_id}/destinations/{destination_id} Delete destination

Data Forwarding

- POST /accounts/{account_id}/data Receive JSON data and forward to all destinations Headers: pgsql CopyEdit   app_secret_token: <token from account>
- Content-Type: application/json
- Body: any JSON payload

Authentication

- For /data endpoint, requests must include a valid app_secret_token header matching the account's token.

Testing the API
Manual Testing
Use Postman or curl:

- Create an account bash CopyEdit   curl -X POST http://localhost:3000/accounts -d '{"name":"Test Account"}' -H "Content-Type: application/json"
-
- Add a destination for the account (replace {account_id}) bash CopyEdit   curl -X POST http://localhost:3000/accounts/{account_id}/destinations -d '{"url":"https://webhook.site/your-url","method":"POST"}' -H "Content-Type: application/json"
-
- Forward data to destinations (replace {account_id} and token) bash CopyEdit   curl -X POST http://localhost:3000/accounts/{account_id}/data -d '{"test":"data"}' -H "Content-Type: application/json" -H "app_secret_token: <token>"
-

Test Plan Outline
Test Case Expected Result
Create account with valid data 201 Created, returns account with token
Create account with invalid data 400 Bad Request, error message
Get existing account 200 OK, returns account data
Get non-existing account 404 Not Found
Update account with valid data 200 OK, updated account
Delete existing account 200 OK, account removed
Create destination for account 201 Created, returns destination
Get destinations list for account 200 OK, array of destinations
Forward data with valid token 200 OK, forwards to all destinations
Forward data with invalid token 401 Unauthorized
Forward data with no destinations 200 OK, but message indicates no destinations
Forward data with invalid JSON body 400 Bad Request

Notes

- All responses are JSON.
- Use proper Content-Type: application/json headers.
- Ensure app_secret_token header is set when forwarding data.
- Destinations must be valid URLs and methods.

Feel free to extend or automate tests using tools like Jest, Mocha, or Postman collections.
