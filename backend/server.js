const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* ================= AUTH ================= */

// SIGNUP
app.post("/auth/signup", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
        (err) => {
            if (err) return res.status(500).send("User exists");
            res.send("Signup successful");
        }
    );
});

// LOGIN
app.post("/auth/login", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE username=? AND password=?",
        [username, password],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(401).send("Invalid login");
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
    db.query(
        "SELECT * FROM contacts WHERE user_id=?",
        [req.params.user_id],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json(result);
        }
    );
});

// DELETE contact
app.delete("/data/:id", (req, res) => {
    db.query(
        "DELETE FROM contacts WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Deleted");
        }
    );
});

// STUDENT NOTES CRUD
app.post("/notes/add", (req, res) => {
    const { user_id, subject, title, content } = req.body;
    db.query(
        "INSERT INTO notes (user_id, subject, title, content) VALUES (?, ?, ?, ?)",
        [user_id, subject, title, content],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Note added");
        }
    );
});

app.get("/notes/:user_id", (req, res) => {
    db.query(
        "SELECT * FROM notes WHERE user_id=? ORDER BY created_at DESC",
        [req.params.user_id],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json(result);
        }
    );
});

app.delete("/notes/:id", (req, res) => {
    db.query(
        "DELETE FROM notes WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Note deleted");
        }
    );
});

/* ================= STATIC FRONTEND ================= */
const path = require("path");
app.use(express.static(path.resolve(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/index.html"));
});

/* ================= SERVER ================= */

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});