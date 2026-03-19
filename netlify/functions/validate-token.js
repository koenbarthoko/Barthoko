// Netlify function: validate-token
// Called by the frontend to check if a given token is valid.
// Tokens are stored as comma-separated values in the INVITE_TOKENS env variable.
// Example: INVITE_TOKENS=abc123,def456,ghi789

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ valid: false }) };
  }

  const { token } = body;
  if (!token) {
    return { statusCode: 200, body: JSON.stringify({ valid: false }) };
  }

  const validTokens = (process.env.INVITE_TOKENS || '')
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(Boolean);

  const isValid = validTokens.includes(token.trim().toLowerCase());

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valid: isValid })
  };
};
