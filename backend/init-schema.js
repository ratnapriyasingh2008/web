/**
 * Database initialization utility
 * Automatically creates tables if they don't exist
 */

const db = require("./db");

const SCHEMA = [
    `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        subject VARCHAR(100) NOT NULL,
        title VARCHAR(150) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at)
    )`
];

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        let completed = 0;
        
        SCHEMA.forEach((sql, index) => {
            db.query(sql, (err) => {
                if (err) {
                    console.error(`❌ Error creating table ${index + 1}:`, err.message);
                    return reject(err);
                }
                
                completed++;
                const tableNames = ["users", "contacts", "notes"];
                console.log(`✅ Table '${tableNames[index]}' ready`);
                
                if (completed === SCHEMA.length) {
                    console.log("✅ All database tables initialized");
                    resolve();
                }
            });
        });
    });
}

module.exports = { initializeDatabase };
