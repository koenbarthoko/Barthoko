const Mollie = require('@mollie/api-client');
const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const id = new URLSearchParams(event.body).get('id');
  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing payment id' }) };
  }

  const mollieClient = Mollie.createMollieClient({
    apiKey: process.env.MOLLIE_API_KEY
  });

  const payment = await mollieClient.payments.get(id);

  if (payment.status !== 'paid') {
    return { statusCode: 200, body: 'not paid' };
  }

  const { tier, amount, email } = payment.metadata;

  const store = getStore('investments');
  const existing = await store.get('progress', { type: 'json' }) || { total: 0, count: 0 };

  await store.set('progress', JSON.stringify({
    total: existing.total + Number(amount),
    count: existing.count + 1
  }));

  await store.set(`investor-${Date.now()}`, JSON.stringify({
    tier, amount, email, paidAt: new Date().toISOString()
  }));

  return { statusCode: 200, body: 'ok' };
};
