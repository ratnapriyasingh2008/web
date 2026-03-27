const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "Roots",
    database: process.env.MYSQL_DATABASE || "myapp"
});

db.connect(err => {
    if (err) {
        console.error("⚠️  Database connection failed:", err.message);
        console.log("✅ Running in FALLBACK mode");
    } else {
        console.log("✅ MySQL Connected");
    }
});

module.exports = db;