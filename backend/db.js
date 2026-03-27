const mysql = require("mysql2");

const dbConfig = {
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "Roots",
    database: process.env.MYSQL_DATABASE || "myapp",
    port: process.env.MYSQL_PORT || 3306
};

let db;

// Try to create real MySQL connection
try {
    db = mysql.createConnection(dbConfig);
    
    db.connect(err => {
        if (err) {
            console.error("❌ Database connection failed:", err.message);
            console.log("⚠️  Using MOCK database (in-memory storage)");
            db = createMockDatabase();
        } else {
            console.log("✅ MySQL Connected");
        }
    });
} catch (error) {
    console.error("❌ Failed to create database connection:", error.message);
    console.log("⚠️  Using mock database (in-memory storage)");
    db = createMockDatabase();
}

// Mock database for when MySQL is unavailable
function createMockDatabase() {
    const mockData = {
        users: [],
        contacts: [],
        notes: []
    };
    
    let userIdCounter = 1;
    let contactIdCounter = 1;
    let noteIdCounter = 1;

    return {
        query: function(sql, params, callback) {
            // Handle INSERT INTO users
            if (sql.includes("INSERT INTO users")) {
                const user = { 
                    id: userIdCounter++, 
                    username: params[0], 
                    password: params[1],
                    created_at: new Date()
                };
                mockData.users.push(user);
                callback(null, { insertId: user.id, affectedRows: 1 });
                return;
            }
            
            // Handle INSERT INTO contacts
            if (sql.includes("INSERT INTO contacts")) {
                const contact = { 
                    id: contactIdCounter++, 
                    user_id: params[0], 
                    name: params[1], 
                    email: params[2],
                    created_at: new Date()
                };
                mockData.contacts.push(contact);
                callback(null, { insertId: contact.id, affectedRows: 1 });
                return;
            }
            
            // Handle INSERT INTO notes
            if (sql.includes("INSERT INTO notes")) {
                const note = { 
                    id: noteIdCounter++, 
                    user_id: params[0], 
                    subject: params[1], 
                    title: params[2], 
                    content: params[3],
                    created_at: new Date()
                };
                mockData.notes.push(note);
                callback(null, { insertId: note.id, affectedRows: 1 });
                return;
            }
            
            // Handle SELECT users (login)
            if (sql.includes("SELECT * FROM users WHERE username")) {
                const result = mockData.users.filter(u => 
                    u.username === params[0] && u.password === params[1]
                );
                callback(null, result);
                return;
            }
            
            // Handle SELECT contacts
            if (sql.includes("SELECT * FROM contacts WHERE user_id")) {
                const result = mockData.contacts.filter(c => c.user_id == params[0]);
                callback(null, result);
                return;
            }
            
            // Handle SELECT notes
            if (sql.includes("SELECT * FROM notes WHERE user_id")) {
                const result = mockData.notes.filter(n => n.user_id == params[0]);
                callback(null, result);
                return;
            }
            
            // Handle DELETE contacts
            if (sql.includes("DELETE FROM contacts WHERE id")) {
                const idx = mockData.contacts.findIndex(c => c.id == params[0]);
                if (idx > -1) mockData.contacts.splice(idx, 1);
                callback(null, { affectedRows: idx > -1 ? 1 : 0 });
                return;
            }
            
            // Handle DELETE notes
            if (sql.includes("DELETE FROM notes WHERE id")) {
                const idx = mockData.notes.findIndex(n => n.id == params[0]);
                if (idx > -1) mockData.notes.splice(idx, 1);
                callback(null, { affectedRows: idx > -1 ? 1 : 0 });
                return;
            }
            
            // Handle CREATE TABLE (mock succeeds silently)
            if (sql.includes("CREATE TABLE")) {
                callback(null);
                return;
            }
            
            // Default: return empty result
            callback(null, []);
        },
        
        connect: function(callback) {
            if (callback) callback(null);
        }
    };
}

module.exports = db;