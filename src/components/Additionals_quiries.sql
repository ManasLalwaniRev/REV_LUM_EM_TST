-- For Screen vendor_expenses

CREATE TABLE IF NOT EXISTS vendor_expenses (
    id SERIAL PRIMARY KEY,
    prime_key VARCHAR(50), -- Used for the history/versioning logic in your code
    vendor_id VARCHAR(100), -- Maps to 'creditCard' in your state
    contract_short_name VARCHAR(255),
    vendor_name VARCHAR(255),
    charge_date DATE,
    charge_amount DECIMAL(15, 2),
    submitted_date DATE,
    pm_email VARCHAR(255),
    charge_code TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    notes TEXT,
    pdf_file_path TEXT,
    submitter_id INTEGER REFERENCES users(id),
    apv_number VARCHAR(50),
    accounting_processed CHAR(1) DEFAULT 'F',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------


-- For Screen creditCard


CREATE TABLE IF NOT EXISTS credit_card_expenses (
    id SERIAL PRIMARY KEY,
    prime_key VARCHAR(50), -- Used for the history/versioning logic in your component
    credit_card VARCHAR(100), -- Chase, Amex, etc.
    contract_short_name VARCHAR(255),
    vendor_name VARCHAR(255),
    charge_date DATE,
    charge_amount DECIMAL(15, 2),
    submitted_date DATE,
    pm_email VARCHAR(255),
    charge_code TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    notes TEXT,
    pdf_file_path TEXT,
    submitter_id INTEGER REFERENCES users(id),
    apv_number VARCHAR(50),
    accounting_processed CHAR(1) DEFAULT 'F',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


--For Travel Expenses Screen


CREATE TABLE IF NOT EXISTS travel_expenses (
    id SERIAL PRIMARY KEY,
    contract_short_name VARCHAR(255) NOT NULL, -- "Project for Travel"
    pdf_file_path TEXT NOT NULL,               -- "Travel Form Link"
    notes TEXT,                                -- As requested for every table
    submitter_id INTEGER REFERENCES users(id), -- Tracks which user submitted the form
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


--For Subcontractor Assignments Screen