const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "✅ Server running", timestamp: new Date() });
});

/* ================= AUTH ================= */

// SIGNUP
app.post("/auth/signup", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        console.error("❌ Missing signup credentials");
        return res.status(400).json({ error: "Missing username or password" });
    }

    db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
        (err, result) => {
            if (err) {
                console.error("❌ Signup error:", err.message);
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({ error: "Username already exists" });
                }
                return res.status(500).json({ error: "Signup failed", details: err.message });
            }
            console.log("✅ New user registered:", username);
            res.json({ success: true, message: "Signup successful", id: result.insertId });
        }
    );
});

// LOGIN
app.post("/auth/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        console.error("❌ Missing login credentials");
        return res.status(400).json({ error: "Missing username or password" });
    }

    db.query(
        "SELECT * FROM users WHERE username=? AND password=?",
        [username, password],
        (err, result) => {
            if (err) {
                console.error("❌ Database error during login:", err.message);
                return res.status(500).json({ error: "Login failed", details: err.message });
            }

            if (result.length > 0) {
                console.log("✅ Login successful for user:", username);
                res.json(result[0]);
            } else {
                console.warn("⚠️  Invalid login attempt for user:", username);
                res.status(401).json({ error: "Invalid username or password" });
            }
        }
    );
});

/* ================= DATA ================= */

// ADD
app.post("/data/add", (req, res) => {
    const { user_id, name, email } = req.body;

    db.query(
        "INSERT INTO contacts (user_id, name, email) VALUES (?, ?, ?)",
        [user_id, name, email],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Added");
        }
    );
});

// GET
app.get("/data/:user_id", (req, res) => {
    const userId = req.params.user_id;
    
    if (!userId) {
        console.error("❌ Missing user_id parameter");
        return res.status(400).json({ error: "Missing user_id" });
    }
    
    db.query(
        "SELECT * FROM contacts WHERE user_id=?",
        [userId],
        (err, result) => {
            if (err) {
                console.error("❌ Database error fetching contacts:", err.message);
                return res.status(500).json({ error: "Failed to fetch contacts", details: err.message });
            }
            console.log(`✅ Fetched ${result ? result.length : 0} contacts for user ${userId}`);
            res.json(result || []);
        }
    );
});

// DELETE contact
app.delete("/data/:id", (req, res) => {
    const contactId = req.params.id;
    
    if (!contactId) {
        console.error("❌ Missing contact id");
        return res.status(400).json({ error: "Missing contact id" });
    }
    
    db.query(
        "DELETE FROM contacts WHERE id=?",
        [contactId],
        (err, result) => {
            if (err) {
                console.error("❌ Database error deleting contact:", err.message);
                return res.status(500).json({ error: "Failed to delete contact", details: err.message });
            }
            console.log("✅ Contact deleted:", contactId);
            res.json({ success: true, message: "Contact deleted" });
        }
    );
});

// STUDENT NOTES CRUD
app.post("/notes/add", (req, res) => {
    const { user_id, subject, title, content } = req.body;
    
    if (!user_id || !subject || !title || !content) {
        console.error("❌ Missing required fields:", { user_id, subject, title, content });
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    db.query(
        "INSERT INTO notes (user_id, subject, title, content) VALUES (?, ?, ?, ?)",
        [user_id, subject, title, content],
        (err, result) => {
            if (err) {
                console.error("❌ Database error adding note:", err.message);
                return res.status(500).json({ error: "Failed to add note", details: err.message });
            }
            console.log("✅ Note added successfully:", result);
            res.json({ success: true, message: "Note added", id: result.insertId });
        }
    );
});

app.get("/notes/:user_id", (req, res) => {
    const userId = req.params.user_id;
    
    if (!userId) {
        console.error("❌ Missing user_id parameter");
        return res.status(400).json({ error: "Missing user_id" });
    }
    
    db.query(
        "SELECT * FROM notes WHERE user_id=? ORDER BY created_at DESC",
        [userId],
        (err, result) => {
            if (err) {
                console.error("❌ Database error fetching notes:", err.message);
                return res.status(500).json({ error: "Failed to fetch notes", details: err.message });
            }
            console.log(`✅ Fetched ${result ? result.length : 0} notes for user ${userId}`);
            res.json(result || []);
        }
    );
});

app.delete("/notes/:id", (req, res) => {
    const noteId = req.params.id;
    
    if (!noteId) {
        console.error("❌ Missing note id parameter");
        return res.status(400).json({ error: "Missing note id" });
    }
    
    db.query(
        "DELETE FROM notes WHERE id=?",
        [noteId],
        (err, result) => {
            if (err) {
                console.error("❌ Database error deleting note:", err.message);
                return res.status(500).json({ error: "Failed to delete note", details: err.message });
            }
            console.log("✅ Note deleted:", noteId);
            res.json({ success: true, message: "Note deleted" });
        }
    );
});

/* ================= STATIC FRONTEND ================= */
const path = require("path");
const fs = require("fs");
const rootDir = path.resolve(__dirname, "..");
const frontendDir = path.resolve(__dirname, "../frontend");

// Explicit route for background image
app.get("/new.jpg", (req, res) => {
    const imagePath = path.join(rootDir, "new.jpg");
    res.sendFile(imagePath, (err) => {
        if (err && err.code === "ENOENT") {
            console.log("new.jpg not found at:", imagePath);
            res.status(404).send("Image not found");
        }
    });
});

// Serve root files first (new.jpg and other assets)
app.use(express.static(rootDir));
// Then serve frontend files
app.use(express.static(frontendDir));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendDir, "index.html"));
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 3000;

// For local development
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
    });
});

// Export for Vercel serverless
module.exports = app;