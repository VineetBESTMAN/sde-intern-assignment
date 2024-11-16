# sde-intern-assignment

# Contact Management API

## Project Overview
This project is a simple contact management system built using Node.js, Express, and SQLite. It includes basic CRUD operations for managing contacts.

## Prerequisites
- **Node.js** (version 14 or higher)
- **npm** or **yarn**
- **SQLite.js**

## Installation

### Install dependencies:
```bash
npm install
```
or
```bash
yarn install
```

### Set up the SQLite database:
Ensure `contacts.db` is in the project root. If not, the server will create it upon running.

## Running the Server

### Start the server:
```bash
npm start
```
or
```bash
node server/index.js
```
The server runs on [http://localhost:3000](http://localhost:3000).

## Running the Client (Optional)
If you have a front-end client (e.g., built with Vite):

### Navigate to the client folder:
```bash
cd client
```

### Install client dependencies:
```bash
npm install
```

### Start the client:
```bash
npm run dev
```
The client will be available on [http://localhost:5173](http://localhost:5173).

## Endpoints

### `GET /api/contacts`
- Fetch all contacts.

### `POST /api/contacts`
- Create a new contact.
- **Payload**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "company": "Company",
    "jobTitle": "Developer"
  }
  ```

### `PUT /api/contacts/:id`
- Update an existing contact by ID.

### `DELETE /api/contacts/:id`
- Delete a contact by ID.

## Troubleshooting
- **Port Issues**: Ensure no other process is using port 3000.
- **CORS Issues**: Double-check the server's CORS configuration if accessing from a different domain.


