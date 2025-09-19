import { getDB } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ msg: 'Required' });

  const db = await getDB();

  // Cek apakah username sudah ada
  const [users] = await db.execute('SELECT id FROM users WHERE username = ?', [username]);
  if (users.length > 0)
    return res.status(409).json({ msg: 'Username already exists' });

  // Simpan user baru
  await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
  res.status(201).json({ msg: 'Register success' });
}