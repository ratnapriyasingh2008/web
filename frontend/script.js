let currentUser = null;

const API = "http://localhost:3000";

// SIGNUP
async function signup() {
    let username = user.value;
    let password = pass.value;

    let res = await fetch(API + "/auth/signup", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ username, password })
    });

    alert(await res.text());
}

// LOGIN
async function login() {
    let username = user.value;
    let password = pass.value;

    let res = await fetch(API + "/auth/login", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ username, password })
    });

    if (res.ok) {
        currentUser = await res.json();
        start();
    } else {
        alert("Wrong login");
    }
}

// START
function start() {
    loginBox.style.display = "none";
    main.style.display = "block";
    welcome.innerText = currentUser.username;
    show();
}

// LOGOUT
function logout() {
    location.reload();
}

// ADD DATA
async function addData() {
    await fetch(API + "/data/add", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            user_id: currentUser.id,
            name: name.value,
            email: email.value
        })
    });

    name.value = "";
    email.value = "";
    show();
}

// SHOW
async function show() {
    let res = await fetch(API + "/data/" + currentUser.id);
    let data = await res.json();

    list.innerHTML = "";

    data.forEach(item => {
        let li = document.createElement("li");
        li.innerHTML = item.name + " - " + item.email;

        let btn = document.createElement("button");
        btn.innerText = "Delete";
        btn.onclick = async () => {
            await fetch(API + "/data/" + item.id, { method: "DELETE" });
            show();
        };

        li.appendChild(btn);
        list.appendChild(li);
    });
}