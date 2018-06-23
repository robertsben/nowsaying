const express = require('express');
const url = require('url');
const spotify = require('./modules/spotify');
const app = express();

app.get('/login', (req, res) => {
  res.redirect(spotify.spotifyAuthorizeApi)
})

app.get('/return', (req, res) => {
  const url_parts = url.parse(req.url, true);
  const code = url_parts.query.code;

  spotify.requestRefreshableAccessToken(code)
    .then((resp) => resp.json())
    .then((json) => res.send(json))
})

app.get('/', (req, res) => {
  spotify.getNowPlaying()
    .then((nowPlaying) => res.send(nowPlaying))
})

app.listen(process.env.PORT, console.log(`Listening on port ${process.env.PORT}`));