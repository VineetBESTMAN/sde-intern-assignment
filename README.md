# sde-intern-assignment

Contact Management API
Project Overview
This project is a simple contact management system built using Node.js, Express, and SQLite. It includes basic CRUD operations for managing contacts.

Prerequisites
Node.js (version 14 or higher)
npm or yarn
SQLite.js
Installation
Clone the repository:

bash
Copy code
git clone <repository-url>
cd <repository-folder>
Install dependencies:

bash
Copy code
npm install
or

bash
Copy code
yarn install
Set up the SQLite database: Ensure contacts.db is in the project root. If not, the server will create it upon running.

Running the Server
Start the server:

bash
Copy code
npm start
or

bash
Copy code
node server/index.js
The server runs on http://localhost:3000.

Running the Client (Optional)
If you have a front-end client (e.g., Vite):

Navigate to the client folder:

bash
Copy code
cd client
Install client dependencies:

bash
Copy code
npm install
Start the client:

bash
Copy code
npm run dev
The client will be available on http://localhost:5173.

Endpoints
GET /api/contacts
Fetch all contacts.
POST /api/contacts
Create a new contact.
Payload:
json
Copy code
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "company": "Company",
  "jobTitle": "Developer"
}
PUT /api/contacts/
Update an existing contact by ID.
DELETE /api/contacts/
Delete a contact by ID.
Troubleshooting
Port Issues: Ensure no other process is using port 3000.
CORS Issues: Double-check the server's CORS configuration if accessing from a different domain.
