CREATE DATABASE IF NOT EXISTS medical_checker;
USE medical_checker;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    predicted_disease VARCHAR(100) NOT NULL,
    symptoms_input TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    contact VARCHAR(50),
    location VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0.0
);

-- Insert some sample doctors
INSERT INTO doctors (name, specialization, contact, location, rating) VALUES
('Dr. Smith', 'Fungal infection', '+1-555-0101', 'New York, NY', 4.5),
('Dr. Jones', 'Allergy', '+1-555-0102', 'Los Angeles, CA', 4.8),
('Dr. Williams', 'GERD', '+1-555-0103', 'Chicago, IL', 4.2),
('Dr. Brown', 'Chronic cholestasis', '+1-555-0104', 'Houston, TX', 4.7),
('Dr. Taylor', 'Drug Reaction', '+1-555-0105', 'Phoenix, AZ', 4.6),
('Dr. Davies', 'Peptic ulcer diseae', '+1-555-0106', 'Philadelphia, PA', 4.4),
('Dr. Evans', 'AIDS', '+1-555-0107', 'San Antonio, TX', 4.9),
('Dr. Thomas', 'Diabetes', '+1-555-0108', 'San Diego, CA', 4.3),
('Dr. Roberts', 'Gastroenteritis', '+1-555-0109', 'Dallas, TX', 4.5),
('Dr. Wilson', 'Bronchial Asthma', '+1-555-0110', 'San Jose, CA', 4.7),
('Dr. Campbell', 'Hypertension', '+1-555-0111', 'Austin, TX', 4.6);
