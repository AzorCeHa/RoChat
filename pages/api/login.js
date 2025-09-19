import { getDB } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ msg: 'Required' });

  const db = await getDB();

  // Cek user
  const [users] = await db.execute('SELECT id FROM users WHERE username = ? AND password = ?', [username, password]);
  if (users.length === 0)
    return res.status(401).json({ msg: 'Invalid credentials' });

  res.status(200).json({ msg: 'Login success', user: users[0] });
}