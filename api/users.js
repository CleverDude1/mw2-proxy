export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const allUsers = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch('https://martiangames.com/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer a6cc01d0-205e-45cc-8550-d06c9c721e66'
        },
        body: `page=${page}&limit=1000` // using 1000 per page for faster fetch
      });

      const data = await response.json();

      if (!data || data.length === 0) {
        hasMore = false; // no more users
      } else {
        allUsers.push(...data);
        page++; // next page
      }
    }

    res.status(200).json(allUsers);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proxy failed' });
  }
}
