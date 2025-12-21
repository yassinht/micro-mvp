const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/health', (req, res) => res.json({ status: 'gql-gateway-ok' }));

// simple in-memory event log (for demo)
const events = [];

app.post('/events', (req, res) => {
  const { type, data } = req.body || {};
  if (!type || !data) {
    return res.status(400).json({ error: 'invalid event' });
  }
  // store in memory (demo) — later we'll publish to PubSub/subscriptions
  events.push({ type, data, receivedAt: new Date().toISOString() });
  console.log('Received event:', type, data);
  // respond immediately
  return res.json({ ok: true });
});

// debug endpoint to see last events
app.get('/events', (req, res) => {
  res.json(events.slice(-50).reverse());
});

app.listen(4000, () => {
  console.log('GraphQL Gateway listening on 4000');
});
