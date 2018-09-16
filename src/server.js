const express = require('express');
const url = require('url');
const spotify = require('./modules/spotify');
const nowsaying = require('./modules/nowsaying');
const config = require('./config');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  let details;
  nowsaying.getNowPlayingSongArtist()
    .then(songArtist => { details = songArtist; return details; })
    .then(nowsaying.getLyricsFromSongArtist)
    .then(lyrics => res.render('home', {
      owner: config.OWNER,
      lyrics: lyrics,
      songdetails: details
    }));
})

app.get('/login', (req, res) => {
  // used to get spotify credentials from oauth signin flow
  res.redirect(spotify.spotifyAuthorizeApi)
})

app.get('/return', (req, res) => {
  // spotify oauth callback
  const url_parts = url.parse(req.url, true);
  const code = url_parts.query.code;

  spotify.requestRefreshableAccessToken(code)
    .then((resp) => resp.json())
    .then((json) => res.send(json))
})

app.get('/callback/genius', (req, res) => {
//  @TODO if necessary
})

app.get('/callback/twitter', (req, res) => {
//  @TODO if necessary
})

app.get('/lyricmatches', (req, res) => {
  // get the lyrics that match the currently playing song on user spotify account
  nowsaying.getLyricsFromNowPlaying()
    .then((lyrics) => res.send(lyrics))
})

app.get('/nowplaying', (req, res) => {
  // get the currently playing song on user spotify account
  nowsaying.getNowPlaying()
    .then((nowPlaying) => res.send(nowPlaying))
})

app.get('/tweet', (req, res) => {
  nowsaying.tweetNowPlaying()
    .then(resp => resp.json())
    .then(json => res.send(json))
})

app.listen(process.env.PORT, console.log(`Listening on port ${process.env.PORT}`));