let currentUser = null;

const API = "http://localhost:3000";

const userInput = document.getElementById("user");
const passInput = document.getElementById("pass");
const loginBox = document.getElementById("loginBox");
const main = document.getElementById("main");
const welcome = document.getElementById("welcome");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const list = document.getElementById("list");
const subjectInput = document.getElementById("subject");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const noteList = document.getElementById("noteList");

// MESSAGE SYSTEM
function showMessage(message, type = "success") {
    const msgDiv = document.createElement("div");
    msgDiv.className = type;
    msgDiv.textContent = message;
    msgDiv.style.position = "fixed";
    msgDiv.style.top = "20px";
    msgDiv.style.right = "20px";
    msgDiv.style.zIndex = "9999";
    msgDiv.style.padding = "15px 20px";
    msgDiv.style.borderRadius = "8px";
    msgDiv.style.animation = "slideIn 0.3s ease";
    document.body.appendChild(msgDiv);
    
    setTimeout(() => msgDiv.remove(), 3000);
}

// ADD STYLES FOR ANIMATIONS
document.head.insertAdjacentHTML("beforeend", `
<style>
@keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
</style>
`);

// SIGNUP
async function signup() {
    let username = userInput.value.trim();
    let password = passInput.value.trim();

    if (!username || !password) {
        showMessage("❌ Enter username and password", "error");
        return;
    }

    if (password.length < 4) {
        showMessage("❌ Password must be at least 4 characters", "error");
        return;
    }

    try {
        let res = await fetch(API + "/auth/signup", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ username, password })
        });

        let msg = await res.text();
        
        if (res.ok) {
            showMessage("✅ Account created! Now login.", "success");
            userInput.value = "";
            passInput.value = "";
        } else {
            showMessage("❌ " + msg, "error");
        }
    } catch (err) {
        showMessage("❌ Network error. Check server.", "error");
    }
}

// LOGIN
async function login() {
    let username = userInput.value.trim();
    let password = passInput.value.trim();

    if (!username || !password) {
        showMessage("❌ Enter username and password", "error");
        return;
    }

    try {
        let res = await fetch(API + "/auth/login", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            currentUser = await res.json();
            showMessage(`✅ Welcome, ${username}!`, "success");
            start();
        } else {
            showMessage("❌ Invalid username or password", "error");
        }
    } catch (err) {
        showMessage("❌ Network error. Check server.", "error");
    }
}

// START - Show dashboard
function start() {
    loginBox.style.display = "none";
    main.style.display = "block";
    welcome.innerText = currentUser.username;
    show();
}

// LOGOUT
function logout() {
    showMessage("👋 Logged out successfully!", "success");
    setTimeout(() => {
        currentUser = null;
        loginBox.style.display = "block";
        main.style.display = "none";
        userInput.value = "";
        passInput.value = "";
        list.innerHTML = "";
        noteList.innerHTML = "";
    }, 500);
}

// ADD DATA (Contact)
async function addData() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
        showMessage("❌ Please enter contact name and email", "error");
        return;
    }

    if (!email.includes("@")) {
        showMessage("❌ Please enter a valid email", "error");
        return;
    }

    if (!currentUser || !currentUser.id) {
        showMessage("❌ User not logged in", "error");
        return;
    }

    try {
        console.log("👥 Adding contact:", { user_id: currentUser.id, name, email });
        
        let res = await fetch(API + "/data/add", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                user_id: currentUser.id,
                name,
                email
            })
        });

        let data = await res.json();
        
        if (res.ok && data.success) {
            console.log("✅ Contact added:", data);
            showMessage(`✅ Contact "${name}" added!`, "success");
            nameInput.value = "";
            emailInput.value = "";
            await show();
        } else {
            console.error("❌ Server error:", data);
            showMessage(`❌ Error: ${data.error || "Failed to add contact"}`, "error");
        }
    } catch (err) {
        console.error("❌ Network error:", err);
        showMessage("❌ Network error: " + err.message, "error");
    }
}

// SHOW - Load all contacts and notes
async function show() {
    try {
        let res = await fetch(API + "/data/" + currentUser.id);
        let data = await res.json();

        list.innerHTML = "";
        if (!Array.isArray(data)) {
            data = [];
        }
        document.getElementById("contactCount").innerText = data.length || 0;

        if (data.length === 0) {
            list.innerHTML = "<p style='color: #999; font-style: italic;'>No contacts yet. Add one to get started!</p>";
        } else {
            data.forEach(item => {
                let li = document.createElement("li");
                li.innerHTML = `📧 <strong>${item.name}</strong><br><small style="color: #666;">${item.email}</small>`;

                let btn = document.createElement("button");
                btn.innerText = "🗑️ Delete";
                btn.style.background = "#e74c3c";
                btn.onclick = async () => {
                    await fetch(API + "/data/" + item.id, { method: "DELETE" });
                    showMessage(`✅ Contact deleted`, "success");
                    show();
                };

                li.appendChild(btn);
                list.appendChild(li);
            });
        }

        await showNotes();
    } catch (err) {
        console.error("Error loading contacts:", err);
        document.getElementById("contactCount").innerText = 0;
        showMessage("❌ Error loading contacts", "error");
    }
}

// ADD NOTE
async function addNote() {
    const subject = subjectInput.value.trim();
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!subject || !title || !content) {
        showMessage("❌ Please fill in subject, title, and content", "error");
        return;
    }

    if (!currentUser || !currentUser.id) {
        showMessage("❌ User not logged in", "error");
        return;
    }

    try {
        console.log("📝 Sending note:", { user_id: currentUser.id, subject, title, content });
        
        let res = await fetch(API + "/notes/add", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                user_id: currentUser.id,
                subject,
                title,
                content
            })
        });

        let data = await res.json();
        
        if (res.ok && data.success) {
            console.log("✅ Note saved successfully:", data);
            showMessage(`✅ Note "${title}" saved!`, "success");
            subjectInput.value = "";
            titleInput.value = "";
            contentInput.value = "";
            await show();
        } else {
            console.error("❌ Server error:", data);
            showMessage(`❌ Error: ${data.error || "Failed to save note"}`, "error");
        }
    } catch (err) {
        console.error("❌ Network error:", err);
        showMessage("❌ Network error: " + err.message, "error");
    }
}

// SHOW NOTES
async function showNotes() {
    try {
        let res = await fetch(API + "/notes/" + currentUser.id);
        let notes = await res.json();

        noteList.innerHTML = "";
        if (!Array.isArray(notes)) {
            notes = [];
        }
        document.getElementById("noteCount").innerText = notes.length || 0;

        if (notes.length === 0) {
            noteList.innerHTML = "<p style='color: #999; font-style: italic;'>No notes yet. Create one to get started!</p>";
        } else {
            notes.forEach(note => {
                let li = document.createElement("li");
                li.innerHTML = `<strong style="color: #2c3e50;">📝 ${note.subject}</strong><br><em style="color: #666;">${note.title}</em><br><p style="margin-top: 8px; color: #555; font-size: 0.9rem;">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</p>`;

                let btn = document.createElement("button");
                btn.innerText = "🗑️ Delete";
                btn.style.background = "#e74c3c";
                btn.onclick = async () => {
                    await fetch(API + "/notes/" + note.id, { method: "DELETE" });
                    showMessage(`✅ Note deleted`, "success");
                    showNotes();
                };

                li.appendChild(btn);
                noteList.appendChild(li);
            });
        }
    } catch (err) {
        console.error("Error loading notes:", err);
        document.getElementById("noteCount").innerText = 0;
        showMessage("❌ Error loading notes", "error");
    }
}