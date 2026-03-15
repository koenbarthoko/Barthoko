const Mollie = require('@mollie/api-client');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { tier, amount, firstname, lastname, email } = body;

  if (!tier || !amount || !firstname || !email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  const mollieClient = Mollie.createMollieClient({
    apiKey: process.env.MOLLIE_API_KEY
  });

  const descriptions = {
    proever:   'Bar THOKO - Proever (EUR 120 consumptietegoed)',
    vriend:    'Bar THOKO - Vriend (EUR 310 consumptietegoed)',
    supporter: 'Bar THOKO - Supporter lening 4% (EUR 600 over 5 jaar)',
    backer:    'Bar THOKO - Backer l
