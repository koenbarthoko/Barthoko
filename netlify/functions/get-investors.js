const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  try {
    const store = getStore('investments');
    const { blobs } = await store.list({ prefix: 'investor-' });

    const investors = [];
    for (const blob of blobs) {
      const data = await store.get(blob.key, { type: 'json' });
      if (data && data.visible) {
        investors.push({
          name: data.firstname,
          tier: data.tier.charAt(0).toUpperCase() + data.tier.slice(1)
        });
      }
    }

    investors.sort((a, b) => (b.paidAt || '').localeCompare(a.paidAt || ''));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ investors })
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ investors: [] })
    };
  }
};
