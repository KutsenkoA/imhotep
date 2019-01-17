const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
const port = process.env.port || 3000;

const FRONTEND = process.env.FRONTEND || 'http://localhost.com:4210';
const CLIENT_ID = '7c474e27de89589114f9';
const CLIENT_SECRET = 'ffb5981db5420d255cb7ef90847bf454efffff4f';
const GITHUB_URL = 'https://github.com/login/oauth/access_token';

app.use(bodyParser.json());

app.all('*', (req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': FRONTEND,
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  next();
});

app.post('/token', (req, res) => {
  const code = req.body.code;

  fetch(`${GITHUB_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => response.json())
    .then(response => res.send(response))
    .catch(() => res.sendStatus(500));

});

app.get('/contract', (req, res) => {
  const { url, token } = req.query;
  fetch(url, {
    headers: {
      Authorization: `token ${token}`
    }
  }).then(response => response.text())
    .then(response => res.send(response))
    .catch(() => res.sendStatus(500));
});

app.listen(port, () => console.log(`server listening on port ${port}`));

