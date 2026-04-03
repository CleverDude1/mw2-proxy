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
        'Origin': 'https://martiangames.com',
        'Referer': 'https://martiangames.com/portal/game/leaderboard',
        'Authorization': 'Bearer d58566b4-d72c-44ef-a931-d9fa9c899106'
      },
      body: 'page=1&limit=10000'
    });

    const text = await response.text();

    // 🔥 Parse safely
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Invalid JSON:', text.slice(0, 200));
      return res.status(500).json({ error: 'Invalid API response' });
    }

    // 🔥 FILTER OUT BAD ACCOUNTS (no level filter now)
    const filtered = data.filter(user => {
      const u = user.current || {};

      const nickname = u.nickname;
      const xp = Number(u.xp) || 0;

      // ❌ Remove bad entries
      if (!nickname || nickname.trim() === '') return false;
      if (nickname.toLowerCase() === 'unknown') return false;
      if (xp <= 0) return false;

      return true;
    });

    // Optional debug
    console.log(`Original: ${data.length}, Filtered: ${filtered.length}`);

    // ✅ Return CLEAN data
    res.status(200).json(filtered);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proxy failed' });
  }
}
