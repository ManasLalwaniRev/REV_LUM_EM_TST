-- -- For Screen vendor_expenses

-- CREATE TABLE IF NOT EXISTS vendor_expenses (
--     id SERIAL PRIMARY KEY,
--     prime_key VARCHAR(50), -- Used for the history/versioning logic in your code
--     vendor_id VARCHAR(100), -- Maps to 'creditCard' in your state
--     contract_short_name VARCHAR(255),
--     vendor_name VARCHAR(255),
--     charge_date DATE,
--     charge_amount DECIMAL(15, 2),
--     submitted_date DATE,
--     pm_email VARCHAR(255),
--     charge_code TEXT,
--     is_approved BOOLEAN DEFAULT FALSE,
--     notes TEXT,
--     pdf_file_path TEXT,
--     submitter_id INTEGER REFERENCES users(id),
--     apv_number VARCHAR(50),
--     accounting_processed CHAR(1) DEFAULT 'F',
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- --------------------------------------------------


-- -- For Screen creditCard


-- CREATE TABLE IF NOT EXISTS credit_card_expenses (
--     id SERIAL PRIMARY KEY,
--     prime_key VARCHAR(50), -- Used for the history/versioning logic in your component
--     credit_card VARCHAR(100), -- Chase, Amex, etc.
--     contract_short_name VARCHAR(255),
--     vendor_name VARCHAR(255),
--     charge_date DATE,
--     charge_amount DECIMAL(15, 2),
--     submitted_date DATE,
--     pm_email VARCHAR(255),
--     charge_code TEXT,
--     is_approved BOOLEAN DEFAULT FALSE,
--     notes TEXT,
--     pdf_file_path TEXT,
--     submitter_id INTEGER REFERENCES users(id),
--     apv_number VARCHAR(50),
--     accounting_processed CHAR(1) DEFAULT 'F',
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );


-- --For Travel Expenses Screen


-- CREATE TABLE IF NOT EXISTS travel_expenses (
--     id SERIAL PRIMARY KEY,
--     contract_short_name VARCHAR(255) NOT NULL, -- "Project for Travel"
--     pdf_file_path TEXT NOT NULL,               -- "Travel Form Link"
--     notes TEXT,                                -- As requested for every table
--     submitter_id INTEGER REFERENCES users(id), -- Tracks which user submitted the form
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );


-- --For Subcontractor Assignments Screen



-- ----------------------------------

-- For Email Records Screen

-- SELECT * FROM public.vendor_expenses
-- -- ORDER BY id ASC



-- -- TRUNCATE TABLE vendor_expenses


-- SELECT * FROM CREDIT_CARD_expenses

-- CREATE TABLE IF NOT EXISTS email_records (
--     id SERIAL PRIMARY KEY,
--     prime_key VARCHAR(20) NOT NULL,
--     contract_short_name VARCHAR(255),
--     vendor_name VARCHAR(255),
--     subject TEXT,
--     email_date TIMESTAMP WITH TIME ZONE,
--     sender VARCHAR(255),
--     recipient VARCHAR(255),
--     notes TEXT,
--     pdf_file_path TEXT,
--     submitter_id INTEGER REFERENCES users(id),
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- DROP TABLE email_records

-- CREATE TABLE IF NOT EXISTS email_records (
--     id SERIAL PRIMARY KEY,
--     prime_key VARCHAR(20) NOT NULL, -- Handles 1, 1.1, 1.2 versioning
--     subject TEXT,
--     recipient VARCHAR(255),        -- "Sent To"
--     task VARCHAR(255),
--     body_type VARCHAR(50),         -- Report/Approver/Verification/Correction
--     body_content TEXT,
--     sender VARCHAR(255),
--     contract_short_name VARCHAR(255), -- Kept for organizational filtering
--     pdf_file_path TEXT,
--     submitter_id INTEGER REFERENCES users(id),
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );


-- DROP  TABLE email_records
-- CREATE TABLE IF NOT EXISTS email_records (
--     id SERIAL PRIMARY KEY,
--     prime_key VARCHAR(20) NOT NULL,
--     subject TEXT,
--     recipient VARCHAR(255),
--     task VARCHAR(255),
--     body_type VARCHAR(50),
--     body_content TEXT,
--     sender VARCHAR(255),
--     contract_short_name VARCHAR(255),
--     pdf_file_path TEXT,
--     email_date DATE DEFAULT CURRENT_DATE,
--     submitter_id INTEGER REFERENCES users(id),
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );