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


-- ALTER TABLE email_records ADD COLUMN cc_recipients TEXT;


-- CREATE TABLE IF NOT EXISTS misc_expenses (
--     id SERIAL PRIMARY KEY,
--     prime_key VARCHAR(50) UNIQUE NOT NULL,
--     employee_name VARCHAR(100),
--     office_location VARCHAR(150),
--     expense_items JSONB,  -- This stores the array of rows (Date, Desc, Vendor, etc.)
--     total_amount NUMERIC(10, 2),
--     status VARCHAR(50) DEFAULT 'Submitted',
--     submitter_id INTEGER, -- Links to users table if needed
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS business_meal_expenses (
--     id SERIAL PRIMARY KEY,
--     prime_key VARCHAR(50) UNIQUE NOT NULL,
--     employee_name VARCHAR(100),
--     expense_items JSONB,  -- Stores rows: Date, Purpose, Location, Attendees, Total, Unallowable
--     total_expense NUMERIC(10, 2),
--     total_unallowable NUMERIC(10, 2),
--     total_allowable NUMERIC(10, 2),
--     status VARCHAR(50) DEFAULT 'Submitted',
--     submitter_id INTEGER,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


-- CREATE TABLE IF NOT EXISTS subcontractor_actions (
--     id SERIAL PRIMARY KEY,
--     prime_key VARCHAR(50) UNIQUE NOT NULL,
--     program_manager VARCHAR(100),
--     project_name VARCHAR(100),
--     company_name VARCHAR(150),
--     company_address TEXT,
--     company_poc VARCHAR(100),
--     poc_phone VARCHAR(50),
--     poc_email VARCHAR(100),
--     agreement_type VARCHAR(50), -- FFP, LH, T&M
--     pop_start DATE,
--     pop_end DATE,
--     has_option_periods BOOLEAN,
--     option_periods_through DATE,
--     funding_auth_amount NUMERIC(15, 2),
--     labor_breakout JSONB, -- Stores the array of rows
--     total_labor NUMERIC(15, 2),
--     total_travel NUMERIC(15, 2),
--     total_odc NUMERIC(15, 2),
--     grand_total NUMERIC(15, 2),
--     status VARCHAR(50) DEFAULT 'Submitted',
--     submitter_id INTEGER,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


-- -- Add columns to support Modification requests
-- ALTER TABLE subcontractor_actions 
-- ADD COLUMN IF NOT EXISTS request_type VARCHAR(50) DEFAULT 'New', -- 'New' or 'Modification'
-- ADD COLUMN IF NOT EXISTS subcontract_number VARCHAR(100),        -- For Mods
-- ADD COLUMN IF NOT EXISTS mod_description TEXT,                   -- "What are you requesting to change?"
-- ADD COLUMN IF NOT EXISTS scope_changes TEXT;                     -- "Changes to Scope of Work"