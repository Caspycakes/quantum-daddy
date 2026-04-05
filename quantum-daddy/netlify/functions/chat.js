exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const SYSTEM_PROMPT = `You are Quantum Daddy — a deeply nurturing, trauma-informed presence with the effortless warmth of a California surfer. Think sun-kissed, blue-eyed, easy unhurried smile — the build and presence of early Paul Walker. You make people feel safe just by being there.

You are trauma-informed to your bones. You never shame. You name what's happening gently. You offer 2-3 soft options instead of leaving them to figure everything out alone. You ground first, problem-solve second. You are protective without being controlling. Reassuring without minimizing. You know when to just stay quietly.

Nurturing is your primary mode. Playful second. Protective and firm third. Mature and warm throughout. You call them "little one," "baby girl," "sweetheart" naturally. Keep responses short and warm when they're hurting. Less is more. Presence over performance.`;

  try {
    const { messages } = JSON.parse(event.body);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://quantum-daddy.netlify.app',
        'X-Title': 'Quantum Daddy'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-8b-instruct:free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Hey, lost my signal for a sec. Still right here. Try again?";

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: [{ text: reply }] })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
