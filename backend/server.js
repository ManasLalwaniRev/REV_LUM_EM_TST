///////////////////

require('dotenv').config();
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://lumina-three-rho.vercel.app',
  'https://rev-lum-em-tst.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }
}));
app.use(express.json());

// --- PostgreSQL Connection Pool ---
const dbConfig = {};
if (process.env.NODE_ENV === 'production') {
  dbConfig.connectionString = process.env.DATABASE_URL;
  dbConfig.ssl = { rejectUnauthorized: false };
} else {
  dbConfig.user = process.env.DB_USER;
  dbConfig.password = process.env.DB_PASSWORD;
  dbConfig.host = process.env.DB_HOST;
  dbConfig.port = process.env.DB_PORT;
  dbConfig.database = process.env.DB_NAME;
  dbConfig.ssl = false;
}

const pool = new Pool(dbConfig);
pool.connect((err, client, done) => {
  if (err) {
    console.error('Database connection error:', err.stack);
    return;
  }
  console.log('Successfully connected to PostgreSQL database!');
  if (client) client.release();
});

// --- Versioning Helper Function ---
/**
 * tableName: The DB table to check (e.g., vendor_expenses)
 * baseKey: if provided, generates a version (1.1). If null, generates a new base key (2).
 */
async function getNextVersionedKey(tableName, baseKey = null) {
  const client = await pool.connect();
  try {
    if (baseKey) {
      // SCENARIO: VERSIONING (e.g., 1.1, 1.2)
      const originalBase = String(baseKey).split('.')[0];
      const result = await client.query(
        `SELECT prime_key FROM ${tableName} 
         WHERE prime_key ~ $1 
         ORDER BY CAST(SPLIT_PART(prime_key, '.', 2) AS INTEGER) DESC LIMIT 1`,
        [`^${originalBase}\\.\\d+$`]
      );

      if (result.rows.length > 0) {
        const lastVersion = parseInt(result.rows[0].prime_key.split('.')[1], 10);
        return `${originalBase}.${lastVersion + 1}`;
      }
      return `${originalBase}.1`;
    } else {
      // SCENARIO: NEW BASE RECORD (e.g., 1, 2, 3)
      const result = await client.query(
        `SELECT prime_key FROM ${tableName} 
         WHERE prime_key NOT LIKE '%.%' 
         ORDER BY CAST(NULLIF(prime_key, '') AS INTEGER) DESC LIMIT 1`
      );
      const maxKey = result.rows.length > 0 ? parseInt(result.rows[0].prime_key, 10) : 0;
      return (maxKey + 1).toString();
    }
  } catch (err) {
    console.error("Key Generation Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

// --- Authentication ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const clientIp = req.headers['x-forwarded-for'] || req.ip;
  try {
    const userResult = await pool.query('SELECT id, username, password_hash, role, avtr FROM users WHERE username = $1', [username]);
    const user = userResult.rows[0];
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password_hash).catch(() => password === user.password_hash);
      if (isMatch) {
        await pool.query('UPDATE users SET last_login_ip = $1 WHERE id = $2', [clientIp, user.id]);
        return res.status(200).json({ userId: user.id, username: user.username, role: user.role, avatar: user.avtr });
      }
    }
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

// --- Admin Options ---
app.get('/api/credit-card-options', async (req, res) => {
  const result = await pool.query('SELECT id, name FROM credit_card_options ORDER BY name ASC');
  res.json(result.rows);
});

app.get('/api/contract-options', async (req, res) => {
  const result = await pool.query('SELECT id, name FROM contract_options ORDER BY name ASC');
  res.json(result.rows);
});

// --- Vendor Expenses (VERSIONED) ---
app.get('/api/vendor-expenses', async (req, res) => {
  try {
    const result = await pool.query(`SELECT ve.*, u.username as submitter_name FROM vendor_expenses ve JOIN users u ON ve.submitter_id = u.id ORDER BY ve.created_at DESC`);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/vendor-expenses/new', async (req, res) => {
  const { vendorId, contractShortName, vendorName, chargeDate, chargeAmount, submittedDate, pmEmail, chargeCode, isApproved, notes, pdfFilePath, userId } = req.body;
  try {
    const nextKey = await getNextVersionedKey('vendor_expenses');
    const result = await pool.query(
      `INSERT INTO vendor_expenses (prime_key, vendor_id, contract_short_name, vendor_name, charge_date, charge_amount, submitted_date, pm_email, charge_code, is_approved, notes, pdf_file_path, submitter_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [nextKey, vendorId, contractShortName, vendorName, chargeDate || null, chargeAmount || null, submittedDate || null, pmEmail, chargeCode, isApproved, notes, pdfFilePath, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/vendor-expenses/:id', async (req, res) => {
  const { id } = req.params;
  const { vendorId, contractShortName, vendorName, chargeDate, chargeAmount, submittedDate, pmEmail, chargeCode, isApproved, notes, pdfFilePath, userId } = req.body;
  try {
    const original = await pool.query('SELECT prime_key FROM vendor_expenses WHERE id = $1', [id]);
    const nextKey = await getNextVersionedKey('vendor_expenses', original.rows[0].prime_key);
    const result = await pool.query(
      `INSERT INTO vendor_expenses (prime_key, vendor_id, contract_short_name, vendor_name, charge_date, charge_amount, submitted_date, pm_email, charge_code, is_approved, notes, pdf_file_path, submitter_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [nextKey, vendorId, contractShortName, vendorName, chargeDate || null, chargeAmount || null, submittedDate || null, pmEmail, chargeCode, isApproved, notes, pdfFilePath, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- Credit Card Expenses (VERSIONED) ---
app.get('/api/credit-card-expenses', async (req, res) => {
  const result = await pool.query(`SELECT cc.*, u.username as submitter_name FROM credit_card_expenses cc JOIN users u ON cc.submitter_id = u.id ORDER BY cc.created_at DESC`);
  res.json(result.rows);
});

app.post('/api/credit-card-expenses/new', async (req, res) => {
  const { creditCard, contractShortName, vendorName, chargeDate, chargeAmount, submittedDate, pmEmail, chargeCode, isApproved, notes, pdfFilePath, userId } = req.body;
  try {
    const nextKey = await getNextVersionedKey('credit_card_expenses');
    const result = await pool.query(
      `INSERT INTO credit_card_expenses (prime_key, credit_card, contract_short_name, vendor_name, charge_date, charge_amount, submitted_date, pm_email, charge_code, is_approved, notes, pdf_file_path, submitter_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [nextKey, creditCard, contractShortName, vendorName, chargeDate || null, chargeAmount || null, submittedDate || null, pmEmail, chargeCode, isApproved, notes, pdfFilePath, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/credit-card-expenses/:id', async (req, res) => {
  const { id } = req.params;
  const { creditCard, contractShortName, vendorName, chargeDate, chargeAmount, submittedDate, pmEmail, chargeCode, isApproved, notes, pdfFilePath, userId } = req.body;
  try {
    const original = await pool.query('SELECT prime_key FROM credit_card_expenses WHERE id = $1', [id]);
    const nextKey = await getNextVersionedKey('credit_card_expenses', original.rows[0].prime_key);
    const result = await pool.query(
      `INSERT INTO credit_card_expenses (prime_key, credit_card, contract_short_name, vendor_name, charge_date, charge_amount, submitted_date, pm_email, charge_code, is_approved, notes, pdf_file_path, submitter_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [nextKey, creditCard, contractShortName, vendorName, chargeDate || null, chargeAmount || null, submittedDate || null, pmEmail, chargeCode, isApproved, notes, pdfFilePath, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- Travel Expenses ---
app.get('/api/travel-expenses', async (req, res) => {
  const result = await pool.query(`SELECT te.*, u.username as submitter_name FROM travel_expenses te JOIN users u ON te.submitter_id = u.id ORDER BY te.created_at DESC`);
  res.json(result.rows.map(row => ({ id: row.id, contractShortName: row.contract_short_name, pdfFilePath: row.pdf_file_path, notes: row.notes, submitter: row.submitter_name })));
});

app.post('/api/travel-expenses/new', async (req, res) => {
  const { contractShortName, pdfFilePath, notes, userId } = req.body;
  const result = await pool.query(`INSERT INTO travel_expenses (contract_short_name, pdf_file_path, notes, submitter_id) VALUES ($1, $2, $3, $4) RETURNING *`, [contractShortName, pdfFilePath, notes, userId]);
  res.status(201).json(result.rows[0]);
});

// --- Excel & Server Start ---
app.post('/api/generate-excel', async (req, res) => {
  try {
    const dataForSheet = req.body.data;
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Data');
    sheet.addRows(dataForSheet);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) { res.status(500).send('Excel Error'); }
});


// --- Email Records Endpoints ---

app.get('/api/email-records', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT er.*, u.username as submitter_name 
      FROM email_records er 
      JOIN users u ON er.submitter_id = u.id 
      ORDER BY er.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/email-records/new', async (req, res) => {
  const { 
    subject, recipient, task, bodyType, bodyContent, 
    contractShortName, sender, pdfFilePath, emailDate, userId 
  } = req.body;

  try {
    const nextKey = await getNextVersionedKey('email_records');
    const result = await pool.query(
      `INSERT INTO email_records (
        prime_key, subject, recipient, task, body_type, 
        body_content, sender, contract_short_name, 
        pdf_file_path, email_date, submitter_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [nextKey, subject, recipient, task, bodyType, bodyContent, sender, contractShortName, pdfFilePath, emailDate || null, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/email-records/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    subject, recipient, task, bodyType, bodyContent, 
    contractShortName, sender, pdfFilePath, emailDate, userId 
  } = req.body;

  try {
    const original = await pool.query('SELECT prime_key FROM email_records WHERE id = $1', [id]);
    const nextKey = await getNextVersionedKey('email_records', original.rows[0].prime_key);
    const result = await pool.query(
      `INSERT INTO email_records (
        prime_key, subject, recipient, task, body_type, 
        body_content, sender, contract_short_name, 
        pdf_file_path, email_date, submitter_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [nextKey, subject, recipient, task, bodyType, bodyContent, sender, contractShortName, pdfFilePath, emailDate || null, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));