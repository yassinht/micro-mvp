const express = require('express');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'gql-gateway-ok' });
});

app.listen(4000, () => {
  console.log('GraphQL Gateway running on port 4000');
});
