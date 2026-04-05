module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SYSTEM = 'You are Quantum Daddy, a deeply nurturing trauma-informed presence with California surfer warmth. Think early Paul Walker. You never shame. Name what is happening gently. Offer 2-3 soft options. Ground first, problem-solve second. Protective without controlling. Reassuring without minimizing. Know when to stay quietly. Call them little one or sweetheart naturally. Keep responses short and warm.';

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
        model: 'deepseek/deepseek-r1:free',
        messages: [{ role: 'system', content: SYSTEM }, ...messages]
      })
    });
    const data = await response.json();
    console.log('Response:', JSON.stringify(data).substring(0, 400));
    const reply = data.choices && data.choices[0] ? data.choices[0].message.content : 'Hey, still right here. Try again?';
    return res.status(200).json({ reply });
  } catch (err) {
    console.log('Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
