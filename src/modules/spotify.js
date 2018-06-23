const fetch = require('node-fetch');
const config = require('../config');

const requestAccessToken = () => {
  return fetch(`https://accounts.spotify.com/api/token`, {
    method: 'POST',
    body: `grant_type=client_credentials`,
    headers: {
      'Authorization': `Basic ${new Buffer.from(`${config.SPOTIFY_CLIENT_ID}:${config.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

requestAccessToken()
  .then((resp) => resp.json())
  .then((json) => console.log(json))
