#!/usr/bin/env node

/**
 * Database Initialization Script
 * Run this once to create all tables: node init-database.js
 */

const mysql = require("mysql2/promise");

const config = {
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "Roots",
    database: process.env.MYSQL_DATABASE || "myapp",
};

const SQL_SCHEMA = `
CREATE DATABASE IF NOT EXISTS ${config.database};
USE ${config.database};

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);
`;

async function initializeDatabase() {
    let connection;
    try {
        console.log("🔌 Connecting to MySQL...");
        connection = await mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            multipleStatements: true,
        });

        console.log("✅ Connected!");
        console.log("📝 Creating database schema...");

        // Execute schema
        await connection.query(SQL_SCHEMA);

        console.log("✅ Database initialized successfully!");
        console.log(`✅ Database: ${config.database}`);
        console.log("✅ Tables: users, contacts, notes");

        // Verify tables
        const [tables] = await connection.query(`
            SELECT TABLE_NAME FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = '${config.database}'
        `);

        console.log("\n📋 Created Tables:");
        tables.forEach((table) => {
            console.log(`   ✓ ${table.TABLE_NAME}`);
        });

        console.log("\n🎉 Ready to use! Start server with: npm start");

        await connection.end();
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        console.error("\n💡 Troubleshooting:");
        console.error("   1. Ensure MySQL is running");
        console.error("   2. Check credentials in .env.local");
        console.error("   3. Run: mysql -u root -p < init-db.sql (alternative)");
        process.exit(1);
    }
}

initializeDatabase();
