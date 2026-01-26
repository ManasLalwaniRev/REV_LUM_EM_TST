// require('dotenv').config();
// // Add these new imports at the top
// const ExcelJS = require('exceljs');
// const fs = require('fs');
// const path = require('path');

// const express = require('express');
// const { Pool } = require('pg');
// const cors = require('cors');
// const bcrypt = require('bcrypt');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // --- Middleware ---
// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://localhost:5173',
//   'https://lumina-three-rho.vercel.app',
//   'https://rev-lum-em-tst.vercel.app/',
//   'https://rev-lum-em-tst.vercel.app'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       // callback(new Error('Not allowed by CORS'));
//       callback(null, false); // <-- CORRECTED
//     }
//   }
// }));
// app.use(express.json());

// // --- PostgreSQL Connection Pool ---
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
//   client.release();
// });

// // --- Helper Function for Prime Key Generation ---
// async function getNextPrimeKey(baseKey = null) {
//   const client = await pool.connect();
//   try {
//     let nextPrimeKey;
//     if (baseKey) {
//       const baseParts = baseKey.split('.');
//       const originalBase = baseParts[0];

//       const result = await client.query(
//         `SELECT prime_key FROM entries
//          WHERE prime_key ~ $1
//          ORDER BY CAST(SPLIT_PART(prime_key, '.', 2) AS INTEGER) DESC
//          LIMIT 1`,
//         [`^${originalBase}\\.\\d+$`]
//       );

//       if (result.rows.length > 0) {
//         const lastVersionKey = result.rows[0].prime_key;
//         const lastVersionParts = lastVersionKey.split('.');
//         const currentVersion = parseInt(lastVersionParts[1], 10);
//         nextPrimeKey = `${originalBase}.${currentVersion + 1}`;
//       } else {
//         nextPrimeKey = `${originalBase}.1`;
//       }
//     } else {
//       const result = await client.query(`
//         SELECT prime_key FROM entries
//         WHERE prime_key NOT LIKE '%.%'
//         ORDER BY CAST(prime_key AS INTEGER) DESC
//         LIMIT 1;
//       `);

//       let maxNumericPart = 0;
//       if (result.rows.length > 0) {
//         const numericPart = parseInt(result.rows[0].prime_key, 10);
//         if (!isNaN(numericPart)) {
//             maxNumericPart = numericPart;
//         }
//       }
//       const nextId = maxNumericPart + 1;
//       nextPrimeKey = `${nextId}`;
//     }
//     return nextPrimeKey;
//   } catch (error) {
//     console.error('Error in getNextPrimeKey:', error);
//     throw error;
//   } finally {
//     if (client) {
//       client.release();
//     }
//   }
// }


// // --- API Endpoints ---

// // POST for creating a new user
// app.post('/api/users/new', async (req, res) => {
//   const { username, password_hash, role, avatar } = req.body;
//   if (!username || !password_hash || !role) {
//     return res.status(400).json({ message: 'Username, password, and role are required.' });
//   }
//   try {
//     const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
//     if (existingUser.rows.length > 0) {
//       return res.status(409).json({ message: 'Username already exists.' });
//     }
//     const result = await pool.query(
//       'INSERT INTO users (username, password_hash, role, avtr) VALUES ($1, $2, $3, $4) RETURNING id, username, role, avtr',
//       [username, password_hash, role, avatar]
//     );
//     res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
//   } catch (err) {
//     console.error('Error creating new user:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // GET all users (Admin only)
// app.get('/api/users', async (req, res) => {
//   const { userRole } = req.query;
//   if (userRole !== 'admin') {
//     return res.status(403).json({ message: 'Access denied. Admin role required.' });
//   }
//   try {
//     const result = await pool.query('SELECT id, username, role, avtr FROM users ORDER BY username ASC');
//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.error('Error fetching users:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // PATCH a user's role (Admin only)
// app.patch('/api/users/:id', async (req, res) => {
//   const { id } = req.params;
//   const { role, adminRole } = req.body;
//   if (adminRole !== 'admin') {
//     return res.status(403).json({ message: 'Access denied. Admin role required.' });
//   }
//   if (!role) {
//     return res.status(400).json({ message: 'Role is required.' });
//   }
//   try {
//     const result = await pool.query(
//       'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role',
//       [role, id]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'User not found.' });
//     }
//     res.status(200).json({ message: 'User role updated successfully', user: result.rows[0] });
//   } catch (err) {
//     console.error(`Error updating role for user ID ${id}:`, err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // PATCH a user's avatar
// app.patch('/api/users/:id/avatar', async (req, res) => {
//   const { id } = req.params;
//   const { avatar } = req.body;

//   if (!avatar) {
//     return res.status(400).json({ message: 'Avatar URL is required.' });
//   }

//   try {
//     const result = await pool.query(
//       'UPDATE users SET avtr = $1 WHERE id = $2 RETURNING id, username, avtr',
//       [avatar, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     res.status(200).json({ message: 'User avatar updated successfully', user: result.rows[0] });
//   } catch (err) {
//     console.error(`Error updating avatar for user ID ${id}:`, err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// // Login Endpoint
// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;
//   const clientIp = req.headers['x-forwarded-for'] || req.ip;
//   try {
//     const userResult = await pool.query('SELECT id, username, password_hash, role, avtr FROM users WHERE username = $1', [username]);
//     const user = userResult.rows[0];

//     if (user && (await bcrypt.compare(password, user.password_hash))) {
//       await pool.query('UPDATE users SET last_login_ip = $1 WHERE id = $2', [clientIp, user.id]);
//       res.status(200).json({ userId: user.id, username: user.username, role: user.role, avatar: user.avtr });
//     } else {
//       res.status(401).json({ message: 'Invalid credentials' });
//     }
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // GET all entries
// app.get('/api/entries', async (req, res) => {
//   const { userId, userRole } = req.query;
//   try {
//     let query = 'SELECT * FROM entries';
//     const values = [];
//     if (userRole !== 'admin' && userRole !== 'accountant') {
//       query += ' WHERE submitter_id = $1';
//       values.push(userId);
//     }
//     query += ' ORDER BY prime_key DESC';
//     const result = await pool.query(query, values);
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Error fetching entries:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // POST a new entry
// app.post('/api/entries/new', async (req, res) => {
//   const {
//     creditCard, contractShortName, vendorName, chargeAmount, submitter, chargeCode, notes, pdfFilePath, userId
//   } = req.body;

//   const chargeDate = req.body.chargeDate === '' ? null : req.body.chargeDate;
//   const submittedDate = req.body.submittedDate === '' ? null : req.body.submittedDate;
//   const finalChargeAmount = chargeAmount === '' ? null : chargeAmount;

//   try {
//     const newPrimeKey = await getNextPrimeKey();
//     const result = await pool.query(
//       `INSERT INTO entries (prime_key, credit_card, contract_short_name, vendor_name, charge_date, charge_amount, submitted_date, submitter, charge_code, notes, pdf_file_path, submitter_id)
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
//       [newPrimeKey, creditCard, contractShortName, vendorName, chargeDate,
//        finalChargeAmount, submittedDate, submitter, chargeCode, notes, pdfFilePath, userId]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error('Error adding new entry:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // PATCH an existing entry
// app.patch('/api/entries/:id', async (req, res) => {
//   const { id } = req.params;
//   const { userId, userRole, ...updatedFields } = req.body;
//   const client = await pool.connect();

//   try {
//     if (userRole === 'accountant' || userRole === 'admin') {
//       const fields = [];
//       const values = [];
//       let valueIndex = 1;

//       for (const key in updatedFields) {
//         if (Object.prototype.hasOwnProperty.call(updatedFields, key)) {
//           if (updatedFields[key] !== undefined) {
//             let snakeCaseKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

//             if (key === 'accountantNotes') {
//               snakeCaseKey = 'accounting_notes';
//             }

//             fields.push(`${snakeCaseKey} = $${valueIndex++}`);
//             values.push(updatedFields[key]);
//           }
//         }
//       }

//       if (fields.length === 0) {
//         return res.status(400).json({ error: 'No valid fields to update.' });
//       }

//       values.push(id);
//       const updateQuery = `UPDATE entries SET ${fields.join(', ')} WHERE id = $${valueIndex} RETURNING *`;
//       const result = await client.query(updateQuery, values);

//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Entry not found for update.' });
//       }
//       return res.status(200).json(result.rows[0]);
//     }

//     const originalEntryResult = await client.query('SELECT * FROM entries WHERE id = $1', [id]);
//     const originalEntry = originalEntryResult.rows[0];

//     if (!originalEntry) {
//       return res.status(404).json({ error: 'Original entry not found for versioning.' });
//     }

//     if (String(originalEntry.submitter_id) !== String(userId)) {
//       return res.status(403).json({ error: 'Unauthorized to create a new version of this entry.' });
//     }

//     const newPrimeKey = await getNextPrimeKey(originalEntry.prime_key);

//     const newEntryData = {
//       prime_key: newPrimeKey,
//       credit_card: updatedFields.creditCard ?? originalEntry.credit_card,
//       contract_short_name: updatedFields.contractShortName ?? originalEntry.contract_short_name,
//       vendor_name: updatedFields.vendorName ?? originalEntry.vendor_name,
//       charge_date: updatedFields.chargeDate ?? originalEntry.charge_date,
//       charge_amount: updatedFields.chargeAmount ?? originalEntry.charge_amount,
//       submitted_date: updatedFields.submittedDate ?? originalEntry.submitted_date,
//       submitter: updatedFields.submitter ?? originalEntry.submitter,
//       charge_code: updatedFields.chargeCode ?? originalEntry.charge_code,
//       notes: updatedFields.notes ?? originalEntry.notes,
//       pdf_file_path: updatedFields.pdfFilePath ?? originalEntry.pdf_file_path,
//       accounting_processed: originalEntry.accounting_processed,
//       date_processed: originalEntry.date_processed,
//       apv_number: originalEntry.apv_number,
//       submitter_id: originalEntry.submitter_id,
//       accounting_notes: originalEntry.accounting_notes,
//     };

//     const columns = Object.keys(newEntryData);
//     const insertValues = Object.values(newEntryData);
//     const valuePlaceholders = columns.map((_, i) => `$${i + 1}`).join(', ');

//     const insertQuery = `INSERT INTO entries (${columns.join(', ')}) VALUES (${valuePlaceholders}) RETURNING *`;
//     const result = await client.query(insertQuery, insertValues);

//     res.status(201).json(result.rows[0]);

//   } catch (err) {
//     console.error(`Error in PATCH /api/entries/${id}:`, err);
//     res.status(500).json({ error: 'Internal server error.' });
//   } finally {
//     client.release();
//   }
// });

// // --- API Endpoints for Settings Management (Admin Only) ---

// // CONTRACT OPTIONS
// app.get('/api/contract-options', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM contract_options ORDER BY name ASC');
//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.error('Error fetching contract options:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.post('/api/contract-options', async (req, res) => {
//   const { name, userRole } = req.body;
//   if (userRole !== 'admin') {
//     return res.status(403).json({ message: 'Access denied.' });
//   }
//   if (!name) {
//     return res.status(400).json({ message: 'Name is required.' });
//   }
//   try {
//     const result = await pool.query('INSERT INTO contract_options (name) VALUES ($1) RETURNING *', [name]);
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error('Error adding contract option:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.delete('/api/contract-options/:id', async (req, res) => {
//     const { id } = req.params;
//     const { userRole } = req.body;
//     if (userRole !== 'admin') {
//         return res.status(403).json({ message: 'Access denied.' });
//     }
//     try {
//         const result = await pool.query('DELETE FROM contract_options WHERE id = $1 RETURNING *', [id]);
//         if (result.rowCount === 0) {
//             return res.status(404).json({ message: 'Option not found.' });
//         }
//         res.status(200).json({ message: 'Contract option deleted successfully' });
//     } catch (err) {
//         console.error('Error deleting contract option:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// // CREDIT CARD OPTIONS
// app.get('/api/credit-card-options', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM credit_card_options ORDER BY name ASC');
//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.error('Error fetching credit card options:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.post('/api/credit-card-options', async (req, res) => {
//   const { name, userRole } = req.body;
//   if (userRole !== 'admin') {
//     return res.status(403).json({ message: 'Access denied.' });
//   }
//   if (!name) {
//     return res.status(400).json({ message: 'Name is required.' });
//   }
//   try {
//     const result = await pool.query('INSERT INTO credit_card_options (name) VALUES ($1) RETURNING *', [name]);
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error('Error adding credit card option:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.delete('/api/credit-card-options/:id', async (req, res) => {
//     const { id } = req.params;
//     const { userRole } = req.body;
//     if (userRole !== 'admin') {
//         return res.status(403).json({ message: 'Access denied.' });
//     }
//     try {
//         const result = await pool.query('DELETE FROM credit_card_options WHERE id = $1 RETURNING *', [id]);
//         if (result.rowCount === 0) {
//             return res.status(404).json({ message: 'Option not found.' });
//         }
//         res.status(200).json({ message: 'Credit card option deleted successfully' });
//     } catch (err) {
//         console.error('Error deleting credit card option:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // --- NEW ENDPOINT FOR EXCEL GENERATION ---
// app.post('/api/generate-excel', async (req, res) => {
//     try {
//         const dataForSheet = req.body.data;

//         if (!dataForSheet || dataForSheet.length === 0) {
//             return res.status(400).json({ error: 'No data provided for export.' });
//         }

//         // Create a new workbook and worksheet
//         const workbook = new ExcelJS.Workbook();
//         const sheet = workbook.addWorksheet('DataEntries');

//         // Load the logo from the server's file system
//         // IMPORTANT: Create an 'assets' folder in your backend and place the logo there
// //         const logoPath = path.join(__dirname, 'assets', 'Lumina_logo.png'); 
// //         console.log('Checking for logo at path:', logoPath); // Add this line to see the path
// //         if (fs.existsSync(logoPath)) {
// //           console.log('✅ Logo found! Adding to Excel file.'); // Add this line
// //             const logoImage = workbook.addImage({
// //                 buffer: fs.readFileSync(logoPath),
// //                 extension: 'png',
// //             });
// //             // Place the logo, e.g., in cells A1 to C5
// //             sheet.addImage(logoImage, 'A1:B6');
// //             sheet.getCell('C6').value = new Date().toLocaleString();

// //         } else {
// //     console.log('❌ Logo not found at path. Skipping image addition.'); // Add this line
// //         }
// //         // Add a title
// //         // sheet.getCell('A6').value = "Lumina Data Export";
// //         sheet.getCell('A6').font = { size: 16, bold: true };

// //         // Define headers from the first data object
// //         // const headers = Object.keys(dataForSheet[0]).map(key => ({ header: key, key: key, width: 25 }));
// //         // sheet.columns = headers;
        
// //         // Style the header row (starting at row 8)
// //         // sheet.getRow(8).font = { bold: true };

// // const headers = Object.keys(dataForSheet[0]);

// // // Insert headers into row 7
// // const headerRow = sheet.getRow(7);
// // headers.forEach((header, index) => {
// //     const cell = headerRow.getCell(index + 1); // ExcelJS is 1-indexed
// //     cell.value = header;
// //     cell.font = { bold: true };
// //     cell.fill = {
// //         type: 'pattern',
// //         pattern: 'solid',
// //         fgColor: { argb: 'FFE0E0E0' } // Light gray
// //     };
// //     sheet.getColumn(index + 1).width = 25;
// // });
// // headerRow.commit();
// // dataForSheet.forEach((dataRow, rowIndex) => {
// //     const row = sheet.getRow(8 + rowIndex);
// //     headers.forEach((header, colIndex) => {
// //         row.getCell(colIndex + 1).value = dataRow[header];
// //     });
// //     row.commit();
// // });
// //         // sheet.getRow(8).fill = {
// //         //     type: 'pattern',
// //         //     pattern: 'solid',
// //         //     fgColor: { argb: 'FFE0E0E0' } // Light gray
// //         // };

// //         // Add the data rows (starting at row 9)
// //         sheet.addRows(dataForSheet);

// // Add a title and date
//         // sheet.getCell('A1').value = "Lumina Data Export";
//         // sheet.getCell('A1').font = { size: 16, bold: true };
//         // sheet.getCell('A2').value = new Date().toLocaleString();

//         // // Get headers from the first data object
//         // const headers = Object.keys(dataForSheet[0]);

//         // // Insert headers into row 4 (giving space for the title)
//         // const headerRow = sheet.getRow(4);
//         // headers.forEach((header, index) => {
//         //     const cell = headerRow.getCell(index + 1); // ExcelJS is 1-indexed
//         //     cell.value = header;
//         //     cell.font = { bold: true };
//         //     cell.fill = {
//         //         type: 'pattern',
//         //         pattern: 'solid',
//         //         fgColor: { argb: 'FFE0E0E0' } // Light gray
//         //     };
//         //     // Set column width
//         //     sheet.getColumn(index + 1).width = 25;
//         // });
//         // headerRow.commit();

//         // // Add the data rows starting from row 5
//         // dataForSheet.forEach((dataRow, rowIndex) => {
//         //     const row = sheet.getRow(5 + rowIndex); // Start at row 5
//         //     headers.forEach((header, colIndex) => {
//         //         row.getCell(colIndex + 1).value = dataRow[header];
//         //     });
//         //     row.commit();
//         // });
//         // 1. Add the logo
//     const logoPath = path.join(__dirname, 'assets', 'Lumina_logo.png'); 

//     // Check if the logo file exists
//     if (fs.existsSync(logoPath)) {
//         console.log('✅ Logo found! Adding to Excel file.');
//         const logoImage = workbook.addImage({
//             buffer: fs.readFileSync(logoPath),
//             extension: 'png',
//         });
//         // Place the logo, spanning cells A1 to C4
//         sheet.addImage(logoImage, 'A1:B5');
//     } else {
//         console.log('❌ Logo not found at path:', logoPath, '. Skipping image addition.');
//     }

//     // 2. Add Title and Date (below the logo)
//     // sheet.getCell('A5').value = "Lumina Data Export";
//     sheet.getCell('A5').font = { size: 16, bold: true };
//     sheet.getCell('A6').value = `Generated on: ${new Date().toLocaleString()}`;

//     // 3. Add Headers (at row 8, leaving a blank row)
//     const headers = Object.keys(dataForSheet[0]);
//     const headerRow = sheet.getRow(8);
//     headers.forEach((header, index) => {
//         const cell = headerRow.getCell(index + 1);
//         cell.value = header;
//         cell.font = { bold: true };
//         cell.fill = {
//             type: 'pattern',
//             pattern: 'solid',
//             fgColor: { argb: 'FFE0E0E0' } // Light gray
//         };
//         sheet.getColumn(index + 1).width = 25; // Set column width
//     });
//     headerRow.commit();

//     // 4. Add Data Rows (starting at row 9)
//     dataForSheet.forEach((dataRow, rowIndex) => {
//         const row = sheet.getRow(9 + rowIndex);
//         headers.forEach((header, colIndex) => {
//             row.getCell(colIndex + 1).value = dataRow[header];
//         });
//         row.commit();
//     });

//         // Set headers to trigger a file download on the frontend
//         res.setHeader(
//             'Content-Type',
//             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//         );
//         res.setHeader(
//             'Content-Disposition',
//             'attachment; filename=' + 'LuminaDataExport.xlsx'
//         );

//         // Write the workbook to the response
//         await workbook.xlsx.write(res);
//         res.end();

//     } catch (err) {
//         console.error("Error generating Excel file on backend:", err);
//         res.status(500).json({ error: 'Failed to generate Excel file.' });
//     }
// });


// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });





// --- Vendor Expenses Endpoints ---

// GET Vendor Expenses
// app.get('/api/vendor-expenses', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT ve.*, u.username as submitter_name 
//       FROM vendor_expenses ve 
//       JOIN users u ON ve.submitter_id = u.id 
//       ORDER BY ve.created_at DESC
//     `);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch vendor expenses' });
//   }
// });

// // POST New Vendor Expense
// app.post('/api/vendor-expenses/new', async (req, res) => {
//   const { 
//     creditCard, contractShortName, vendorName, chargeDate, 
//     chargeAmount, submittedDate, pmEmail, chargeCode, 
//     isApproved, notes, pdfFilePath, userId 
//   } = req.body;
  
//   try {
//     const result = await pool.query(
//       `INSERT INTO vendor_expenses (
//         vendor_id, contract_short_name, vendor_name, charge_date, 
//         charge_amount, submitted_date, pm_email, charge_code, 
//         is_approved, notes, pdf_file_path, submitter_id
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
//       [creditCard, contractShortName, vendorName, chargeDate, 
//        chargeAmount, submittedDate, pmEmail, chargeCode, 
//        isApproved, notes, pdfFilePath, userId]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to create vendor expense' });
//   }
// });


// // --- Credit Card Expenses Endpoints ---

// // GET all credit card expenses
// app.get('/api/credit-card-expenses', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT cc.*, u.username as submitter_name 
//       FROM credit_card_expenses cc 
//       JOIN users u ON cc.submitter_id = u.id 
//       ORDER BY cc.created_at DESC
//     `);
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Error fetching credit card expenses:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // POST a new credit card expense
// app.post('/api/credit-card-expenses/new', async (req, res) => {
//   const { 
//     creditCard, contractShortName, vendorName, chargeDate, 
//     chargeAmount, submittedDate, pmEmail, chargeCode, 
//     isApproved, notes, pdfFilePath, userId 
//   } = req.body;

//   try {
//     const result = await pool.query(
//       `INSERT INTO credit_card_expenses (
//         credit_card, contract_short_name, vendor_name, charge_date, 
//         charge_amount, submitted_date, pm_email, charge_code, 
//         is_approved, notes, pdf_file_path, submitter_id
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
//       [creditCard, contractShortName, vendorName, chargeDate, 
//        chargeAmount, submittedDate, pmEmail, chargeCode, 
//        isApproved, notes, pdfFilePath, userId]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error('Error creating credit card expense:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // --- Travel Expenses Endpoints ---

// // GET all travel expenses
// app.get('/api/travel-expenses', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT te.*, u.username as submitter_name 
//       FROM travel_expenses te 
//       JOIN users u ON te.submitter_id = u.id 
//       ORDER BY te.created_at DESC
//     `);
//     // Map backend column names to frontend expected names
//     const formattedRows = result.rows.map(row => ({
//       id: row.id,
//       contractShortName: row.contract_short_name,
//       pdfFilePath: row.pdf_file_path,
//       notes: row.notes,
//       submitter: row.submitter_name
//     }));
//     res.json(formattedRows);
//   } catch (err) {
//     console.error('Error fetching travel expenses:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // POST a new travel expense
// app.post('/api/travel-expenses/new', async (req, res) => {
//   const { contractShortName, pdfFilePath, notes, userId } = req.body;
//   try {
//     const result = await pool.query(
//       `INSERT INTO travel_expenses (contract_short_name, pdf_file_path, notes, submitter_id)
//        VALUES ($1, $2, $3, $4) RETURNING *`,
//       [contractShortName, pdfFilePath, notes, userId]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error('Error creating travel expense:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // --- Subcontractor Assignments Endpoints ---

// // GET all subcontractor assignments
// app.get('/api/subcontractor-assignments', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT sa.*, u.username as submitter_name 
//       FROM subcontractor_assignments sa 
//       JOIN users u ON sa.submitter_id = u.id 
//       ORDER BY sa.created_at DESC
//     `);
    
//     // Format keys to match frontend expectations
//     const formattedRows = result.rows.map(row => ({
//       id: row.id,
//       poNo: row.po_no,
//       subkName: row.subk_name,
//       employeeName: row.employee_name,
//       projectCode: row.project_code,
//       plc: row.plc,
//       notes: row.notes,
//       submitter: row.submitter_name
//     }));
    
//     res.json(formattedRows);
//   } catch (err) {
//     console.error('Error fetching subcontractor assignments:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // POST a new subcontractor assignment
// app.post('/api/subcontractor-assignments/new', async (req, res) => {
//   const { poNo, subkName, employeeName, projectCode, plc, notes, userId } = req.body;
//   try {
//     const result = await pool.query(
//       `INSERT INTO subcontractor_assignments (po_no, subk_name, employee_name, project_code, plc, notes, submitter_id)
//        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
//       [poNo, subkName, employeeName, projectCode, plc, notes, userId]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error('Error creating subcontractor assignment:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


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
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/email-records/new', async (req, res) => {
  const { contractShortName, vendorName, subject, emailDate, sender, recipient, notes, pdfFilePath, userId } = req.body;
  try {
    const nextKey = await getNextVersionedKey('email_records');
    const result = await pool.query(
      `INSERT INTO email_records (prime_key, contract_short_name, vendor_name, subject, email_date, sender, recipient, notes, pdf_file_path, submitter_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [nextKey, contractShortName, vendorName, subject, emailDate || null, sender, recipient, notes, pdfFilePath, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/email-records/:id', async (req, res) => {
  const { id } = req.params;
  const { contractShortName, vendorName, subject, emailDate, sender, recipient, notes, pdfFilePath, userId } = req.body;
  try {
    const original = await pool.query('SELECT prime_key FROM email_records WHERE id = $1', [id]);
    const nextKey = await getNextVersionedKey('email_records', original.rows[0].prime_key);
    const result = await pool.query(
      `INSERT INTO email_records (prime_key, contract_short_name, vendor_name, subject, email_date, sender, recipient, notes, pdf_file_path, submitter_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [nextKey, contractShortName, vendorName, subject, emailDate || null, sender, recipient, notes, pdfFilePath, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));