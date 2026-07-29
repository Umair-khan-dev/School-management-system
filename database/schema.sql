-- ============================================
-- School Management System - Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

-- ---------- Admin / staff users who can log into the dashboard ----------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- Students ----------
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roll_no VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  class VARCHAR(20) NOT NULL,
  section VARCHAR(10),
  gender ENUM('Male', 'Female', 'Other'),
  dob DATE,
  email VARCHAR(150),
  phone VARCHAR(20),
  address VARCHAR(255),
  parent_name VARCHAR(100),
  parent_phone VARCHAR(20),
  admission_date DATE DEFAULT (CURRENT_DATE),
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---------- Teachers ----------
CREATE TABLE IF NOT EXISTS teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  qualification VARCHAR(150),
  gender ENUM('Male', 'Female', 'Other'),
  email VARCHAR(150),
  phone VARCHAR(20),
  address VARCHAR(255),
  joining_date DATE DEFAULT (CURRENT_DATE),
  salary DECIMAL(10, 2) DEFAULT 0,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---------- Fees ----------
CREATE TABLE IF NOT EXISTS fees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  fee_type VARCHAR(50) NOT NULL DEFAULT 'Tuition Fee',
  total_amount DECIMAL(10, 2) NOT NULL,
  paid_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  due_date DATE,
  paid_date DATE,
  payment_method ENUM('Cash', 'Card', 'Bank Transfer', 'Online', 'Cheque') DEFAULT 'Cash',
  status ENUM('Paid', 'Partial', 'Unpaid') DEFAULT 'Unpaid',
  remarks VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ---------- Seed a default admin (password: Admin@123, hashed with bcrypt) ----------
-- The hash below corresponds to "Admin@123" - change it after first login.
INSERT INTO users (name, email, password, role)
VALUES ('Super Admin', 'admin@school.com', '$2a$10$8WFoOfJdejiHcsclHIK4Wel9i/H4XvbAqy2px9XIMBJlMKey83dI2', 'admin')
ON DUPLICATE KEY UPDATE email = email;

-- ---------- Sample data (optional, comment out if not needed) ----------
INSERT INTO students (roll_no, name, class, section, gender, dob, email, phone, address, parent_name, parent_phone)
VALUES
('S-2026-001', 'Ayesha Khan', '10', 'A', 'Female', '2010-04-12', 'ayesha.khan@example.com', '03001234567', 'Karachi', 'Imran Khan', '03007654321'),
('S-2026-002', 'Bilal Ahmed', '9', 'B', 'Male', '2011-08-23', 'bilal.ahmed@example.com', '03011234567', 'Lahore', 'Ahmed Raza', '03017654321')
ON DUPLICATE KEY UPDATE roll_no = roll_no;

INSERT INTO teachers (employee_id, name, subject, qualification, gender, email, phone, address, salary)
VALUES
('T-2026-001', 'Sara Malik', 'Mathematics', 'M.Sc Mathematics', 'Female', 'sara.malik@example.com', '03211234567', 'Karachi', 85000),
('T-2026-002', 'Usman Tariq', 'Physics', 'M.Phil Physics', 'Male', 'usman.tariq@example.com', '03221234567', 'Islamabad', 90000)
ON DUPLICATE KEY UPDATE employee_id = employee_id;
