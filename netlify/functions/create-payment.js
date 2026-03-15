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
    backer:    'Bar THOKO - Backer lening 4% (EUR 900 over 5 jaar)',
    founding:  'Bar THOKO - Founding lening 4% (EUR 1.200 over 5 jaar)',
    core:      'Bar THOKO - Core lening 4% (EUR 1.800 over 5 jaar)',
    partner:   'Bar THOKO - Partner lening 4% (EUR 3.000 over 5 jaar)',
    angel:     'Bar THOKO - Angel lening 4% (EUR 6.000+ over 5 jaar)',
  };

  try {
    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: amount.toFixed(2)
      },
      description: descriptions[tier] || `Bar THOKO - ${tier}`,
      redirectUrl: `https://barthoko-invest.netlify.app/bedankt?tier=${tier}&naam=${encodeURIComponent(firstname)}`,
      webhookUrl: 'https://barthoko-invest.netlify.app/.netlify/functions/payment-webhook',
      method: 'ideal',
      metadata: { tier, amount, firstname, lastname, email }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ checkoutUrl: payment.getCheckoutUrl() })
    };
  } catch (err) {
    console.error('Mollie error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Mollie aanroep mislukt' })
    };
  }
};
