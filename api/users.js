export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch('https://martiangames.com/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',

        // ✅ REQUIRED (these were missing)
        'Origin': 'https://martiangames.com',
        'Referer': 'https://martiangames.com/portal/game/leaderboard',

        // ⚠️ IMPORTANT: use the NEW token you just captured
        'Authorization': 'Bearer d58566b4-d72c-44ef-a931-d9fa9c899106'
      },

      // ✅ include both page + limit
      body: 'page=1&limit=20000'
    });

    const text = await response.text();

    // Optional debug (VERY useful)
    console.log('Response:', text.slice(0, 200));

    res.status(200).send(text);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proxy failed' });
  }
}
