async function sendChat() {
  const text = document.getElementById('message').value;
  if (!text.trim()) return;

  // Insert chat ke Supabase
  const { error } = await supabase
    .from('chats')
    .insert([{ name: username, text: text }]);
  
  if (error) {
    alert("Gagal kirim chat: " + error.message);
    return;
  } else {
    // Optional: alert("Chat berhasil dikirim!");
    document.getElementById('message').value = '';
    loadChat();
  }
}
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://isjxkovmyafkjuefsvmd.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY // Atur di dashboard Vercel/Netlify
const supabase = createClient(supabaseUrl, supabaseKey)

// Untuk GET chat
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message })
    res.status(200).json(data);
  }
  // Untuk POST chat
  if (req.method === 'POST') {
    const { name, text } = req.body;
    const { error } = await supabase
      .from('chats')
      .insert([{ name, text }]);
    if (error) return res.status(500).json({ error: error.message })
    res.status(200).json({ message: 'Chat saved!' });
  }
}