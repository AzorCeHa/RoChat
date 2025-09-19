const http = require('http');
const fs = require('fs');
const PORT = 3000;

const USERS_FILE = './users.json';

// Pastikan file users.json ada
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/register') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
      if (!username || !password) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: 'Username dan password wajib diisi!'}));
      }
      let users = JSON.parse(fs.readFileSync(USERS_FILE));
      if (users.find(u => u.username === username)) {
        res.writeHead(409, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: 'Username sudah digunakan!'}));
      }
      users.push({ username, password });
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      res.writeHead(200, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify({success: true, message: 'Registrasi sukses!'}));
    });
  } else {
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({message: 'Not Found'}));
  }
});

server.listen(PORT, () => console.log('Server running on port', PORT));