// Simpan chat secara sederhana di memori (reset tiap deploy)
let chats = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(chats);
  } else if (req.method === 'POST') {
    const { name, text } = req.body;
    if (name && text) {
      chats.push({ name, text });
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: 'Missing name or text' });
    }
  }
}