// require('dotenv').config();
// const ExcelJS = require('exceljs');
// const fs = require('fs');
// const path = require('path');
// const express = require('express');
// const { Pool } = require('pg');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // --- 1. Middleware (Critical: MUST be at the top to avoid req.body errors) ---
// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://localhost:5173',
//   'https://lumina-three-rho.vercel.app',
//   'https://rev-lum-em-tst.vercel.app'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(null, false);
//     }
//   }
// }));

// // This processes JSON data. Having this above routes fixes the 'req.body undefined' error.
// app.use(express.json()); 

// // --- 2. Outlook Transporter Configuration (Fixed for Timeout) ---
// const transporter = nodemailer.createTransport({
//   host: "smtp.office365.com",
//   port: 587,
//   secure: false, // TLS requires secure: false for port 587
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, // Your 16-character App Password
//   },
//   tls: {
//     ciphers: 'SSLv1.2', 
//     rejectUnauthorized: false
//   },
//   connectionTimeout: 15000, // 15 seconds timeout to prevent hanging
//   greetingTimeout: 15000
// });

// // --- 3. PostgreSQL Connection Pool ---
// const dbConfig = {};
// if (process.env.NODE_ENV === 'production') {
//   dbConfig.connectionString = process.env.DATABASE_URL;
//   dbConfig.ssl = { rejectUnauthorized: false };
// } else {
//   dbConfig.user = process.env.DB_USER;
//   dbConfig.password = process.env.DB_PASSWORD;
//   dbConfig.host = process.env.DB_HOST;
//   dbConfig.port = process.env.DB_PORT;
//   dbConfig.database = process.env.DB_NAME;
//   dbConfig.ssl = false;
// }

// const pool = new Pool(dbConfig);
// pool.connect((err, client, done) => {
//   if (err) {
//     console.error('Database connection error:', err.stack);
//     return;
//   }
//   console.log('Successfully connected to PostgreSQL database!');
//   if (client) client.release();
// });

// // --- 4. Helper Function: Versioning ---
// async function getNextVersionedKey(tableName, baseKey = null) {
//   const client = await pool.connect();
//   try {
//     if (baseKey) {
//       const originalBase = String(baseKey).split('.')[0];
//       const result = await client.query(
//         `SELECT prime_key FROM ${tableName} 
//          WHERE prime_key ~ $1 
//          ORDER BY CAST(SPLIT_PART(prime_key, '.', 2) AS INTEGER) DESC LIMIT 1`,
//         [`^${originalBase}\\.\\d+$`]
//       );
//       if (result.rows.length > 0) {
//         const lastVersion = parseInt(result.rows[0].prime_key.split('.')[1], 10);
//         return `${originalBase}.${lastVersion + 1}`;
//       }
//       return `${originalBase}.1`;
//     } else {
//       const result = await client.query(
//         `SELECT prime_key FROM ${tableName} 
//          WHERE prime_key NOT LIKE '%.%' 
//          ORDER BY CAST(NULLIF(prime_key, '') AS INTEGER) DESC LIMIT 1`
//       );
//       const maxKey = result.rows.length > 0 ? parseInt(result.rows[0].prime_key, 10) : 0;
//       return (maxKey + 1).toString();
//     }
//   } catch (err) {
//     console.error("Key Generation Error:", err);
//     throw err;
//   } finally {
//     client.release();
//   }
// }

// // --- 5. New Send Email Route ---
// app.post('/api/send-email', async (req, res) => {
//   const { recipient, cc, subject, bodyContent } = req.body;

//   if (!recipient || !subject) {
//     return res.status(400).json({ error: 'Recipient and Subject are required' });
//   }

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: recipient,
//     cc: cc || '', 
//     subject: subject,
//     text: bodyContent,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent: ' + info.response); // Log successful response
//     res.status(200).json({ message: 'Email sent successfully' });
//   } catch (error) {
//     console.error('SMTP Error:', error); // This will show if it's "Auth Failed" or "Timeout"
//     res.status(500).json({ 
//       error: 'Failed to send email', 
//       code: error.code, 
//       command: error.command 
//     });
//   }
// });

// // --- 6. Authentication ---
// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;
//   const clientIp = req.headers['x-forwarded-for'] || req.ip;
//   try {
//     const userResult = await pool.query('SELECT id, username, password_hash, role, avtr FROM users WHERE username = $1', [username]);
//     const user = userResult.rows[0];
//     if (user) {
//       const isMatch = await bcrypt.compare(password, user.password_hash).catch(() => password === user.password_hash);
//       if (isMatch) {
//         await pool.query('UPDATE users SET last_login_ip = $1 WHERE id = $2', [clientIp, user.id]);
//         return res.status(200).json({ userId: user.id, username: user.username, role: user.role, avatar: user.avtr });
//       }
//     }
//     res.status(401).json({ message: 'Invalid credentials' });
//   } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
// });

// // --- 7. Admin Options ---
// app.get('/api/credit-card-options', async (req, res) => {
//   const result = await pool.query('SELECT id, name FROM credit_card_options ORDER BY name ASC');
//   res.json(result.rows);
// });

// app.get('/api/contract-options', async (req, res) => {
//   const result = await pool.query('SELECT id, name FROM contract_options ORDER BY name ASC');
//   res.json(result.rows);
// });

// // --- 8. Vendor Expenses ---
// app.get('/api/vendor-expenses', async (req, res) => {
//   try {
//     const result = await pool.query(`SELECT ve.*, u.username as submitter_name FROM vendor_expenses ve JOIN users u ON ve.submitter_id = u.id ORDER BY ve.created_at DESC`);
//     res.json(result.rows);
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.post('/api/vendor-expenses/new', async (req, res) => {
//   const { vendorId, contractShortName, vendorName, chargeDate, chargeAmount, submittedDate, pmEmail, chargeCode, isApproved, notes, pdfFilePath, userId } = req.body;
//   try {
//     const nextKey = await getNextVersionedKey('vendor_expenses');
//     const result = await pool.query(
//       `INSERT INTO vendor_expenses (prime_key, vendor_id, contract_short_name, vendor_name, charge_date, charge_amount, submitted_date, pm_email, charge_code, is_approved, notes, pdf_file_path, submitter_id)
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
//       [nextKey, vendorId, contractShortName, vendorName, chargeDate || null, chargeAmount || null, submittedDate || null, pmEmail, chargeCode, isApproved, notes, pdfFilePath, userId]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.patch('/api/vendor-expenses/:id', async (req, res) => {
//   const { id } = req.params;
//   const { vendorId, contractShortName, vendorName, chargeDate, chargeAmount, submittedDate, pmEmail, chargeCode, isApproved, notes, pdfFilePath, userId } = req.body;
//   try {
//     const original = await pool.query('SELECT prime_key FROM vendor_expenses WHERE id = $1', [id]);
//     const nextKey = await getNextVersionedKey('vendor_expenses', original.rows[0].prime_key);
//     const result = await pool.query(
//       `INSERT INTO vendor_expenses (prime_key, vendor_id, contract_short_name, vendor_name, charge_date, charge_amount, submitted_date, pm_email, charge_code, is_approved, notes, pdf_file_path, submitter_id)
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
//       [nextKey, vendorId, contractShortName, vendorName, chargeDate || null, chargeAmount || null, submittedDate || null, pmEmail, chargeCode, isApproved, notes, pdfFilePath, userId]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// // --- 9. Credit Card Expenses ---
// app.get('/api/credit-card-expenses', async (req, res) => {
//   const result = await pool.query(`SELECT cc.*, u.username as submitter_name FROM credit_card_expenses cc JOIN users u ON cc.submitter_id = u.id ORDER BY cc.created_at DESC`);
//   res.json(result.rows);
// });

// app.post('/api/credit-card-expenses/new', async (req, res) => {
//   const { creditCard, contractShortName, vendorName, chargeDate, chargeAmount, submittedDate, pmEmail, chargeCode, isApproved, notes, pdfFilePath, userId } = req.body;
//   try {
//     const nextKey = await getNextVersionedKey('credit_card_expenses');
//     const result = await pool.query(
//       `INSERT INTO credit_card_expenses (prime_key, credit_card, contract_short_name, vendor_name, charge_date, charge_amount, submitted_date, pm_email, charge_code, is_approved, notes, pdf_file_path, submitter_id)
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
//       [nextKey, creditCard, contractShortName, vendorName, chargeDate || null, chargeAmount || null, submittedDate || null, pmEmail, chargeCode, isApproved, notes, pdfFilePath, userId]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.patch('/api/credit-card-expenses/:id', async (req, res) => {
//   const { id } = req.params;
//   const { creditCard, contractShortName, vendorName, chargeDate, chargeAmount, submittedDate, pmEmail, chargeCode, isApproved, notes, pdfFilePath, userId } = req.body;
//   try {
//     const original = await pool.query('SELECT prime_key FROM credit_card_expenses WHERE id = $1', [id]);
//     const nextKey = await getNextVersionedKey('credit_card_expenses', original.rows[0].prime_key);
//     const result = await pool.query(
//       `INSERT INTO credit_card_expenses (prime_key, credit_card, contract_short_name, vendor_name, charge_date, charge_amount, submitted_date, pm_email, charge_code, is_approved, notes, pdf_file_path, submitter_id)
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
//       [nextKey, creditCard, contractShortName, vendorName, chargeDate || null, chargeAmount || null, submittedDate || null, pmEmail, chargeCode, isApproved, notes, pdfFilePath, userId]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// // --- 10. Travel Expenses ---
// app.get('/api/travel-expenses', async (req, res) => {
//   const result = await pool.query(`SELECT te.*, u.username as submitter_name FROM travel_expenses te JOIN users u ON te.submitter_id = u.id ORDER BY te.created_at DESC`);
//   res.json(result.rows.map(row => ({ id: row.id, contractShortName: row.contract_short_name, pdfFilePath: row.pdf_file_path, notes: row.notes, submitter: row.submitter_name })));
// });

// app.post('/api/travel-expenses/new', async (req, res) => {
//   const { contractShortName, pdfFilePath, notes, userId } = req.body;
//   const result = await pool.query(`INSERT INTO travel_expenses (contract_short_name, pdf_file_path, notes, submitter_id) VALUES ($1, $2, $3, $4) RETURNING *`, [contractShortName, pdfFilePath, notes, userId]);
//   res.status(201).json(result.rows[0]);
// });

// // --- 11. Excel Generation ---
// app.post('/api/generate-excel', async (req, res) => {
//   try {
//     const dataForSheet = req.body.data;
//     const workbook = new ExcelJS.Workbook();
//     const sheet = workbook.addWorksheet('Data');
//     sheet.addRows(dataForSheet);
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (err) { res.status(500).send('Excel Error'); }
// });

// // --- 12. Email Records History Endpoints (Updated with CC History) ---
// app.get('/api/email-records', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT er.*, u.username as submitter_name 
//       FROM email_records er 
//       JOIN users u ON er.submitter_id = u.id 
//       ORDER BY er.created_at DESC
//     `);
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/api/email-records/new', async (req, res) => {
//   const { 
//     subject, recipient, cc, task, bodyType, bodyContent, 
//     contractShortName, sender, pdfFilePath, emailDate, userId 
//   } = req.body;

//   try {
//     const nextKey = await getNextVersionedKey('email_records');
//     const result = await pool.query(
//       `INSERT INTO email_records (
//         prime_key, subject, recipient, cc_recipients, task, body_type, 
//         body_content, sender, contract_short_name, 
//         pdf_file_path, email_date, submitter_id
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
//       [nextKey, subject, recipient, cc || null, task, bodyType, bodyContent, sender, contractShortName, pdfFilePath, emailDate || null, userId]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error("POST Error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.patch('/api/email-records/:id', async (req, res) => {
//   const { id } = req.params;
//   const { 
//     subject, recipient, cc, task, bodyType, bodyContent, 
//     contractShortName, sender, pdfFilePath, emailDate, userId 
//   } = req.body;

//   try {
//     const original = await pool.query('SELECT prime_key FROM email_records WHERE id = $1', [id]);
//     const nextKey = await getNextVersionedKey('email_records', original.rows[0].prime_key);
//     const result = await pool.query(
//       `INSERT INTO email_records (
//         prime_key, subject, recipient, cc_recipients, task, body_type, 
//         body_content, sender, contract_short_name, 
//         pdf_file_path, email_date, submitter_id
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
//       [nextKey, subject, recipient, cc || null, task, bodyType, bodyContent, sender, contractShortName, pdfFilePath, emailDate || null, userId]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require('dotenv').config();
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Client } = require('@microsoft/microsoft-graph-client');
const { ConfidentialClientApplication } = require('@azure/msal-node');

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. Middleware ---
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

// --- 2. Microsoft Graph Client Configuration ---
const msalConfig = {
  auth: {
    clientId: process.env.MS_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}`,
    clientSecret: process.env.MS_CLIENT_SECRET,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

async function getAuthenticatedClient() {
  const tokenRequest = {
    scopes: ['https://graph.microsoft.com/.default'],
  };
  const response = await cca.acquireTokenByClientCredential(tokenRequest);
  return Client.init({
    authProvider: (done) => done(null, response.accessToken),
  });
}

// --- 3. PostgreSQL Connection Pool ---
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
};

const pool = new Pool(dbConfig);
pool.connect((err) => {
  if (err) console.error('Database connection error:', err.stack);
  else console.log('Successfully connected to PostgreSQL database!');
});

// --- 4. Helper Function: Versioning ---
async function getNextVersionedKey(tableName, baseKey = null) {
  const client = await pool.connect();
  try {
    if (baseKey) {
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

// --- 5. Helper Function: Centralized Email Sender ---
async function sendNotificationEmail(recipient, subject, bodyContent) {
  if (!recipient) return;
  try {
    const client = await getAuthenticatedClient();
    const sendMail = {
      message: {
        subject: subject,
        body: { contentType: 'Text', content: bodyContent },
        toRecipients: [{ emailAddress: { address: recipient } }],
      },
      saveToSentItems: 'true',
    };
    await client.api(`/users/${process.env.EMAIL_USER}/sendMail`).post(sendMail);
    console.log(`Notification sent to ${recipient}`);
  } catch (error) {
    console.error("Internal Email Helper Error:", error.message);
  }
}

// --- 6. Routes ---

// Master Data
app.get('/api/vendors', async (req, res) => {
  try {
    const result = await pool.query('SELECT vendor_id, vendor_name FROM vendors ORDER BY vendor_id ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/credit-card-options', async (req, res) => {
  const result = await pool.query('SELECT id, name FROM credit_card_options ORDER BY name ASC');
  res.json(result.rows);
});

app.get('/api/contract-options', async (req, res) => {
  const result = await pool.query('SELECT id, name FROM contract_options ORDER BY name ASC');
  res.json(result.rows);
});

// Authentication
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const clientIp = req.headers['x-forwarded-for'] || req.ip;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
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

// --- 7. Vendor Expenses (With Auto-Email) ---
app.get('/api/vendor-expenses', async (req, res) => {
  try {
    const result = await pool.query(`SELECT ve.*, u.username as submitter_name FROM vendor_expenses ve LEFT JOIN users u ON ve.submitter_id = u.id ORDER BY ve.created_at DESC`);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const handleVendorNotify = async (data, primeKey) => {
  const body = `Record Update Notification:
Record No: ${primeKey}
Vendor ID: ${data.vendorId}
Vendor Name: ${data.vendorName}
Amount: $${parseFloat(data.chargeAmount || 0).toFixed(2)}
Status: ${data.status || 'Submitted'}

Link: https://rev-lum-em-tst.vercel.app`;
  await sendNotificationEmail(data.pmEmail, `Vendor Expense Review: ${data.vendorName}`, body);
};

app.post('/api/vendor-expenses/new', async (req, res) => {
  const { vendorId, contractShortName, vendorName, chargeDate, chargeAmount, submittedDate, pmEmail, chargeCode, status, notes, pdfFilePath, userId } = req.body;
  try {
    const nextKey = await getNextVersionedKey('vendor_expenses');
    const result = await pool.query(
      `INSERT INTO vendor_expenses (prime_key, vendor_id, contract_short_name, vendor_name, charge_date, charge_amount, submitted_date, pm_email, charge_code, status, notes, pdf_file_path, submitter_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [nextKey, vendorId, contractShortName, vendorName, chargeDate || null, chargeAmount || null, submittedDate || null, pmEmail, chargeCode, status || 'Submitted', notes, pdfFilePath, userId]
    );
    await handleVendorNotify(req.body, nextKey);
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/vendor-expenses/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const original = await pool.query('SELECT prime_key FROM vendor_expenses WHERE id = $1', [id]);
    if (original.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const nextKey = await getNextVersionedKey('vendor_expenses', original.rows[0].prime_key);
    const result = await pool.query(
      `INSERT INTO vendor_expenses (prime_key, vendor_id, contract_short_name, vendor_name, charge_date, charge_amount, submitted_date, pm_email, charge_code, status, notes, pdf_file_path, submitter_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [nextKey, data.vendorId, data.contractShortName, data.vendorName, data.chargeDate || null, data.chargeAmount || null, data.submittedDate || null, data.pmEmail, data.chargeCode, data.status || 'Submitted', data.notes, data.pdfFilePath, data.userId]
    );
    await handleVendorNotify(data, nextKey);
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 8. Credit Card Expenses (With Auto-Email) ---
app.get('/api/credit-card-expenses', async (req, res) => {
  try {
    const result = await pool.query(`SELECT cc.*, u.username as submitter_name FROM credit_card_expenses cc LEFT JOIN users u ON cc.submitter_id = u.id ORDER BY cc.created_at DESC`);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const handleCCNotify = async (data, primeKey) => {
  const body = `Record Update Notification:
Record No: ${primeKey}
Credit Card: ${data.creditCard}
Vendor ID: ${data.vendorId}
Vendor Name: ${data.vendorName}
Amount: $${parseFloat(data.chargeAmount || 0).toFixed(2)}
Status: ${data.status || 'Submitted'}

Link: https://rev-lum-em-tst.vercel.app`;
  await sendNotificationEmail(data.pmEmail, `CC Expense Review: ${data.creditCard}`, body);
};

app.post('/api/credit-card-expenses/new', async (req, res) => {
  const { creditCard, vendorId, contractShortName, vendorName, chargeDate, chargeAmount, submittedDate, pmEmail, chargeCode, status, notes, pdfFilePath, userId } = req.body;
  try {
    const nextKey = await getNextVersionedKey('credit_card_expenses');
    const result = await pool.query(
      `INSERT INTO credit_card_expenses (prime_key, credit_card, vendor_id, contract_short_name, vendor_name, charge_date, charge_amount, submitted_date, pm_email, charge_code, status, notes, pdf_file_path, submitter_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [nextKey, creditCard, vendorId, contractShortName, vendorName, chargeDate || null, chargeAmount || null, submittedDate || null, pmEmail, chargeCode, status || 'Submitted', notes, pdfFilePath, userId]
    );
    await handleCCNotify(req.body, nextKey);
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/credit-card-expenses/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const original = await pool.query('SELECT prime_key FROM credit_card_expenses WHERE id = $1', [id]);
    if (original.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const nextKey = await getNextVersionedKey('credit_card_expenses', original.rows[0].prime_key);
    const result = await pool.query(
      `INSERT INTO credit_card_expenses (prime_key, credit_card, vendor_id, contract_short_name, vendor_name, charge_date, charge_amount, submitted_date, pm_email, charge_code, status, notes, pdf_file_path, submitter_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [nextKey, data.creditCard, data.vendorId, data.contractShortName, data.vendorName, data.chargeDate || null, data.chargeAmount || null, data.submittedDate || null, data.pmEmail, data.chargeCode, data.status || 'Submitted', data.notes, data.pdfFilePath, data.userId]
    );
    await handleCCNotify(data, nextKey);
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 9. Subk & Travel ---
app.get('/api/subk-travel', async (req, res) => {
  try {
    const result = await pool.query(`SELECT st.*, u.username as submitter_name FROM subk_travel_expenses st LEFT JOIN users u ON st.submitter_id = u.id ORDER BY st.created_at DESC`);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/subk-travel/new', async (req, res) => {
  const { category, contractShortName, projectName, pmName, email, ccRecipients, chargeAmount, chargeDate, pdfFilePath, notes, status, subkName, laborCategory, userId } = req.body;
  try {
    const nextKey = await getNextVersionedKey('subk_travel_expenses');
    const result = await pool.query(
      `INSERT INTO subk_travel_expenses (prime_key, category, contract_short_name, project_name, pm_name, email, cc_recipients, charge_amount, charge_date, pdf_file_path, notes, status, subk_name, labor_category, submitter_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [nextKey, category, contractShortName, projectName, pmName, email, ccRecipients, chargeAmount || 0, chargeDate || null, pdfFilePath, notes, status || 'Submitted', subkName, laborCategory, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/subk-travel/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const original = await pool.query('SELECT prime_key FROM subk_travel_expenses WHERE id = $1', [id]);
    if (original.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const nextKey = await getNextVersionedKey('subk_travel_expenses', original.rows[0].prime_key);
    const result = await pool.query(
      `INSERT INTO subk_travel_expenses (prime_key, category, contract_short_name, project_name, pm_name, email, cc_recipients, charge_amount, charge_date, pdf_file_path, notes, status, subk_name, labor_category, submitter_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [nextKey, data.category, data.contractShortName, data.projectName, data.pmName, data.email, data.ccRecipients, data.chargeAmount || 0, data.chargeDate || null, data.pdfFilePath, data.notes, data.status || 'Submitted', data.subkName, data.laborCategory, data.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 10. Automated Change Monitor ---
const CHECK_INTERVAL = 15 * 60 * 1000;
setInterval(async () => {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - CHECK_INTERVAL);
    const result = await pool.query(`
      SELECT 'Vendor' as type, prime_key, vendor_name as name, status FROM vendor_expenses WHERE created_at >= $1
      UNION ALL
      SELECT 'Credit Card' as type, prime_key, vendor_name as name, status FROM credit_card_expenses WHERE created_at >= $1
      UNION ALL
      SELECT 'Subk/Travel' as type, prime_key, project_name as name, status FROM subk_travel_expenses WHERE created_at >= $1
    `, [fifteenMinutesAgo]);

    if (result.rows.length > 0) {
      let reportBody = "Recent Updates (Last 15 Minutes):\n\n";
      result.rows.forEach(row => {
        reportBody += `[${row.type}] Record: ${row.prime_key} | Name: ${row.name} | Status: ${row.status}\n`;
      });
      reportBody += `\nView: https://rev-lum-em-tst.vercel.app`;
      await sendNotificationEmail('Manas.Lalwani@revolvespl.com', "System Alert: Expense Records Modified", reportBody);
    }
  } catch (error) {
    console.error("Monitor Error:", error.message);
  }
}, CHECK_INTERVAL);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Example POST route snippet for mapping
// --- Billing & Invoicing Routes ---

// 1. Fetch all billing records
app.get('/api/billing', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, u.username as submitter_name 
      FROM billing b 
      LEFT JOIN users u ON b.submitter_id = u.id 
      ORDER BY b.created_at DESC`);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Helper for Email Formatting
const handleBillingNotify = async (data, primeKey) => {
  if (!data.shouldNotify || !data.pmEmail) return;
  
  const body = `Invoice Review Required:
Record No: ${primeKey}
Project Name: ${data.projectName}
Contract: ${data.contractShortName}
Amount: $${parseFloat(data.amount || 0).toFixed(2)}
Status: ${data.status}

Link: https://rev-lum-em-tst.vercel.app`;

  await sendNotificationEmail(data.pmEmail, `Billing Notification: ${data.projectName}`, body);
};

// 3. Create New Billing Record
app.post('/api/billing/new', async (req, res) => {
  const { projectName, contractShortName, pmEmail, emailCc, invoiceDate, amount, status, notes, pdfFilePath, userId } = req.body;
  try {
    const nextKey = await getNextVersionedKey('billing');
    const result = await pool.query(
      `INSERT INTO billing (
        prime_key, project_name, contract_short_name, pm_email, email_cc, 
        invoice_date, amount, status, notes, pdf_file_path, submitter_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [nextKey, projectName, contractShortName, pmEmail, emailCc, invoiceDate || null, amount || 0, status || 'Draft', notes, pdfFilePath, userId]
    );
    
    // Trigger notification if requested
    await handleBillingNotify(req.body, nextKey);
    
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. Update/Version Billing Record
app.patch('/api/billing/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const original = await pool.query('SELECT prime_key FROM billing WHERE id = $1', [id]);
    if (original.rows.length === 0) return res.status(404).json({ error: 'Record not found' });

    const nextKey = await getNextVersionedKey('billing', original.rows[0].prime_key);
    const result = await pool.query(
      `INSERT INTO billing (
        prime_key, project_name, contract_short_name, pm_email, email_cc, 
        invoice_date, amount, status, notes, pdf_file_path, submitter_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [nextKey, data.projectName, data.contractShortName, data.pmEmail, data.emailCc, data.invoiceDate || null, data.amount || 0, data.status || 'Draft', data.notes, data.pdfFilePath, data.userId]
    );
    
    await handleBillingNotify(data, nextKey);
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});