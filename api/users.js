export default async function handler(req, res) {
  // CORS
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
        'Content-Type': 'application/json',
        'Authorization': 'Bearer a6cc01d0-205e-45cc-8550-d06c9c721e66'
      },
      body: JSON.stringify({
        page: 1,
        limit: 1000
      })
    });

    const text = await response.text();

    // Debug if API returns error instead of JSON
    if (!text.startsWith('[') && !text.startsWith('{')) {
      console.error('API ERROR:', text);
      return res.status(500).json({ error: text });
    }

    res.status(200).send(text);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proxy failed' });
  }
}
