const express = require('express');
const url = require('url');
const spotify = require('./modules/spotify');
const genius = require('./modules/genius');
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

app.get('/callback/genius', (req, res) => {
//  @TODO if necessary
})

app.get('/lyricmatches', (req, res) => {
  spotify.getNowPlaying()
    .then((nowPlaying) => {
      const songName = nowPlaying.item.name
      const artist = nowPlaying.item.artists[0].name
      const query = `${songName} ${artist}`
      console.log(`Querying for: ${query}`)
      return query
    })
    .then(genius.getLyricSnippet)
    .then((lyrics) => res.send(lyrics))
})

app.get('/nowplaying', (req, res) => {
  spotify.getNowPlaying()
    .catch((err) => res.status(500).send(`Error getting now playing: ${err}`))
    .then((nowPlaying) => res.send(nowPlaying))
})

app.listen(process.env.PORT, console.log(`Listening on port ${process.env.PORT}`));