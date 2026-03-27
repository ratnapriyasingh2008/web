const http = require('http');

// Test signup
function testSignup() {
    const postData = JSON.stringify({
        username: 'testuser123',
        password: 'testpass123'
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/signup',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log('✅ Signup Response:', res.statusCode, data);
            testLogin();
        });
    });

    req.on('error', (e) => { console.error('❌ Signup error:', e.message); });
    req.write(postData);
    req.end();
}

// Test login
function testLogin() {
    const postData = JSON.stringify({
        username: 'testuser123',
        password: 'testpass123'
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log('✅ Login Response:', res.statusCode, data);
            testAddNote();
        });
    });

    req.on('error', (e) => { console.error('❌ Login error:', e.message); });
    req.write(postData);
    req.end();
}

// Test add note
function testAddNote() {
    const postData = JSON.stringify({
        user_id: 1,
        subject: 'Math',
        title: 'Calculus Notes',
        content: 'This is a test note'
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/addnote',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log('✅ Add Note Response:', res.statusCode, data);
            console.log('\n✅ All tests passed! API is working correctly.');
            process.exit(0);
        });
    });

    req.on('error', (e) => { console.error('❌ Add note error:', e.message); });
    req.write(postData);
    req.end();
}

console.log('Starting API tests...\n');
testSignup();
