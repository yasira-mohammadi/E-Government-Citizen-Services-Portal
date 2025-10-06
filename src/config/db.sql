-- Users table (for citizens, officers, department heads, and admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    national_id VARCHAR(50) UNIQUE, -- For citizens
    date_of_birth DATE, -- For citizens
    contact_info VARCHAR(255), -- For citizens
    role VARCHAR(50) NOT NULL, -- citizen, officer, department_head, admin
    department_id INTEGER, -- For officers and department heads
    job_title VARCHAR(100), -- For officers
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    fee DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requests table
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    service_id INTEGER REFERENCES services(id),
    status VARCHAR(50) NOT NULL, -- submitted, under_review, approved, rejected
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    officer_id INTEGER REFERENCES users(id), -- Officer handling the request
    comments TEXT
);

-- Documents table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES requests(id),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES requests(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL, -- pending, completed, failed
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    request_id INTEGER REFERENCES requests(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);