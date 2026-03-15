const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const store = getStore('investments');

  await store.set('progress', JSON.stringify({
    total: 100000,
    count: 2
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, total: 100000, count: 2 })
  };
};
```

Klik **Commit changes**. Wacht tot Netlify deployt en ga dan in je browser naar:
```
https://barthoko-invest.netlify.app/.netlify/functions/init-progress
