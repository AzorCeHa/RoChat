const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

const USERS_FILE = path.join(__dirname, 'users.json');
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');

function send(res, code, obj) {
  res.writeHead(code, {'Content-Type':'application/json'});
  res.end(JSON.stringify(obj));
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/register') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
      if (!username || !password) return send(res, 400, {message:'Username dan password wajib diisi!'});
      let users = JSON.parse(fs.readFileSync(USERS_FILE));
      if (users.find(u => u.username === username)) {
        return send(res, 409, {message:'Username sudah digunakan!'});
      }
      users.push({ username, password });
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      return send(res, 200, {success:true, message:'Registrasi sukses!'});
    });
  } else if (req.method === 'POST' && req.url === '/api/login') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
      let users = JSON.parse(fs.readFileSync(USERS_FILE));
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        return send(res, 200, {success:true, message:'Login sukses!'});
      } else {
        return send(res, 401, {message:'Username atau password salah!'});
      }
    });
  } else {
    send(res, 404, {message:'Not Found'});
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));