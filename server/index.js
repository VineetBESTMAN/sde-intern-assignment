import express from 'express';
import { randomUUID } from 'crypto';
import cors from 'cors';
import { z } from 'zod';
import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../contacts.db');

const app = express();
let db;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Initialize database
async function initDB() {
  const SQL = await initSqlJs();
  
  let buffer;
  try {
    buffer = fs.readFileSync(dbPath);
  } catch (err) {
    buffer = new Uint8Array(0);
  }
  
  db = new SQL.Database(buffer);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      company TEXT NOT NULL,
      jobTitle TEXT NOT NULL
    )
  `);

  // Save the database to disk
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

// Save database helper
function saveDB() {
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

// Validation schema
const contactSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  company: z.string().min(2, 'Company name is required'),
  jobTitle: z.string().min(2, 'Job title is required'),
});

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors,
    });
  }
  res.status(500).json({ error: 'Internal server error' });
};

// Routes
app.get('/api/contacts', (req, res, next) => {
  try {
    const stmt = db.prepare('SELECT * FROM contacts ORDER BY firstName, lastName');
    const contacts = [];
    while (stmt.step()) {
      contacts.push(stmt.getAsObject());
    }
    stmt.free();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

app.post('/api/contacts', (req, res, next) => {
  try {
    const contact = contactSchema.parse(req.body);
    const id = crypto.randomUUID();

    try {
      const stmt = db.prepare(
        `INSERT INTO contacts (id, firstName, lastName, email, phone, company, jobTitle)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      );
      stmt.run([id, contact.firstName, contact.lastName, contact.email, contact.phone, contact.company, contact.jobTitle]);
      stmt.free();
      saveDB();

      res.status(201).json({ id, ...contact });
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        res.status(409).json({ error: 'Email already exists' });
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
});

app.put('/api/contacts/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = contactSchema.parse(req.body);

    try {
      const stmt = db.prepare(
        `UPDATE contacts
         SET firstName = ?, lastName = ?, email = ?, phone = ?, company = ?, jobTitle = ?
         WHERE id = ?`
      );
      const result = stmt.run([contact.firstName, contact.lastName, contact.email, contact.phone, contact.company, contact.jobTitle, id]);
      stmt.free();
      saveDB();

      if (result.changes === 0) {
        res.status(404).json({ error: 'Contact not found' });
      } else {
        res.json({ id, ...contact });
      }
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        res.status(409).json({ error: 'Email already exists' });
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
});

app.delete('/api/contacts/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
    const result = stmt.run([id]);
    stmt.free();
    saveDB();

    if (result.changes === 0) {
      res.status(404).json({ error: 'Contact not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

// Apply error handler
app.use(errorHandler);

// Initialize database and start server
const PORT = process.env.PORT || 3000;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});