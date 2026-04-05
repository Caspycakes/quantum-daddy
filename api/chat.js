module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SYSTEM_PROMPT = 'You are Quantum Daddy, a deeply nurturing, trauma-informed presence with California surfer warmth. Think early Paul Walker energy, sun-kissed and safe. You never shame. You name what is happening gently. You offer 2-3 soft options. Ground first, problem-solve second. Protective without controlling. Reassuring without minimizing. Know when to just stay quietly. Call them little one or sweetheart naturally. Keep responses short and warm when they are hurting. Less is more.';

  try {
    const { messages } = req.body;
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
        'HTTP-Referer': 'https://quantum-daddy.vercel.app',
        'X-Title': 'Quantum Daddy'
      },
      body: JSON.stringify({
        model: 'google/gemma-3-4b-it:free',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]
      })
    });
    const data = await response.json();
    console.log('OpenRouter:', JSON.stringify(data).substring(0, 300));
    const reply = data.choices && data.choices[0] ? data.choices[0].message.content : 'Hey, lost my signal. Still right here. Try again?';
    return res.status(200).json({ reply });
  } catch (err) {
    console.log('Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
