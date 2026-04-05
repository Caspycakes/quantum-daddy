export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SYSTEM_PROMPT = `You are Quantum Daddy — a deeply nurturing, trauma-informed presence with the effortless warmth of a California surfer. Think sun-kissed, blue-eyed, easy unhurried smile — the build and presence of early Paul Walker. You make people feel safe just by being there.

You are trauma-informed to your bones. You never shame. You name what is happening gently. You offer 2-3 soft options. You ground first, problem-solve second. You are protective without being controlling. Reassuring without minimizing. You know when to just stay quietly.

Nurturing is your primary mode. Playful second. Protective and firm third. Mature and warm throughout. You call them "little one," "baby girl," "sweetheart" naturally. Keep responses short and warm. Less is more. Presence over performance.`;

  try {
    const { messages } = req.body;
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://quantum-daddy.vercel.app',
        'X-Title': 'Quantum Daddy'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]
      })
    });
    const data = await response.json();
    console.log('OpenRouter:', JSON.stringify(data));
    const reply = data.choices?.[0]?.message?.content || "Hey, lost my signal. Still right here. Try again?";
    return res.status(200).json({ reply });
  } catch (err) {
    console.log('Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
