README.md for Data Pusher Project

## Data Pusher API

\## Overview Data Pusher is a simple HTTP server built with raw Node.js and SQLite to manage accounts, destinations (webhooks), and forward incoming JSON data to configured destinations securely. ---

\---

##  Swagger UI Documentation

You can now run the server using \*\*Express\*\* and view Swagger UI documentation at:

\[http://localhost:3013/docs/#/\](http://localhost:3013/docs/#/)

\### How to use:

1\. Install dependencies:

\`\`\`bash

npm install express swagger-ui-express

Update your server to use Express and serve Swagger UI:

Use the swagger-ui-express package to serve the swagger.json file.

Swagger UI will be accessible at /docs.

Start your server:

node server.js

Open the browser and navigate to:

bash

[http://localhost:3013/docs](http://localhost:3013/docs)

## Features

## Account Management

- Create, read, update, delete accounts
- Each account has a unique app_secret_token for authentication

## Destination Management

- CRUD operations for destinations tied to an account
- Destinations define URL, HTTP method, and optional headers

## Data Forwarding

- Receive JSON data via a POST endpoint per account
- Authenticate requests using app_secret_token header
- Forward data to all configured destinations for the account

## Original Version

- No external frameworks (original version)
- Uses raw Node.js HTTP server and SQLite database

## Setup

- Clone the repository

- git clone https://github.com/your-username/data-pusher.git

- cd data-pusher

- Install dependencies -npm install sqlite3

- Initialize the database (tables are auto-created in db.js on first run)
- Start the server - node server.js
- Server runs at http://localhost:3013/docs (configurable via PORT env variable)

## API Endpoints

## Accounts

- POST /accounts - Create a new account

Body: { "name": "Account Name" }

- GET /accounts/{account_id} -Get account details

- PUT /accounts/{account_id} - Update account

Body: { "name": "New Name" }

- DELETE /accounts/{account_id} - Delete account

## Destinations

- POST /accounts/{account_id}/destinations -Create destination

Body:

{
  "url": "https://example.com/webhook",
  "method": "POST",
  "headers": { "Authorization": "Bearer abc123" }
}

- GET /accounts/{account_id}/destinations -List all destinations for account

- GET /accounts/{account_id}/destinations/{destination_id} - Get single destination details

- PUT /accounts/{account_id}/destinations/{destination_id}

## Update destination

- DELETE /accounts/{account_id}/destinations/{destination_id} - Delete destination

## Data Forwarding

- POST /accounts/{account_id}/data -Forward JSON data to all destinations for the account
  Headers:

makefile
Content-Type: application/json
app_secret_token: <token>

- Body: Any valid JSON payload.

##Authentication
For the /data endpoint, requests must include a valid app_secret_token in the header matching the account's token.

## Testing the API

\*Manual Testing (Postman / cURL)

- Create an account
  curl -X POST http://localhost:3000/accounts \\

\-H "Content-Type: application/json" \\

\-d '{"name":"Test Account"}'

- Add a destination for the account
  curl -X POST http://localhost:3000/accounts/{account_id}/destinations \\

\-H "Content-Type: application/json" \\

\-d '{"url":"https://webhook.site/your-url","method":"POST"}'

- Forward data
  curl -X POST http://localhost:3000/accounts/{account_id}/data \\

\-H "Content-Type: application/json" \\

\-H "app_secret_token: <token>" \\

\-d '{"test":"data"}'

## Test Plan

- Test Case Expected Result
- Create account with valid data 201 Created, returns account with token
- Create account with invalid data 400 Bad Request, error message
- Get existing account 200 OK, returns account data
- Get non-existing account 404 Not Found
- Update account with valid data 200 OK, updated account
- Delete existing account 200 OK, account removed
- Create destination for account 201 Created, returns destination
- Get destinations list for account 200 OK, array of destinations
- Forward data with valid token 200 OK, forwards to all destinations
- Forward data with invalid token 401 Unauthorized
- Forward data with no destinations 200 OK, but message indicates no destinations
- Forward data with invalid JSON body 400 Bad Request

## SQLite Viewer Options  

\* Option 1: CLI Access via Terminal
- Use sqlite3:
- sqlite3 mydb.sqlit
- View tables: .tables
- Query data: SELECT \* FROM accounts;
- Exit with .quit

## Option 2: Use VS Code Extension
- If you use Visual Studio Code, follow these steps:
- Open VS Code
- Go to Extensions (Cmd + Shift + X)
- Search: SQLite Viewer or SQLite
- Install a plugin like SQLite Explorer
- Open your .sqlite file from the sidebar
- Browse and query data visually

## Notes

- All responses are in JSON.
- Ensure proper headers like Content-Type: application/json are set.
- Use valid app_secret_token headers for data forwarding.
- Destinations must be valid HTTP URLs and methods.
