const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const spotify = require('./modules/spotify');
const twitter = require('./modules/twitter');
const lyrics = require('./modules/lyrics');
const nowsaying = require('./modules/nowsaying');
const config = require('./config');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '..', 'public')));

let currentLyrics;

app.get('/', (req, res) => {
  let details;
  nowsaying.getNowPlayingDetails()
    .then(songArtist => { details = songArtist; return details; })
    .then(nowsaying.getFullLyricsFromSongArtist)
    .then(fullLyrics => {
      currentLyrics = fullLyrics;
      return fullLyrics;
    })
    .then(lyrics.chooseRandomSnippet)
    .then(lyrics => {
      res.render('home', {
        owner_handle: config.OWNER_HANDLE,
        twitter_handle: config.TWITTER_HANDLE,
        lyrics: lyrics,
        songdetails: details,
        auth: config.TWEET_AUTH_USER
      })
    });
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

app.route('/tweet')
  .get((req, res) => {
    nowsaying.tweetNowPlaying()
      .then(resp => resp.json())
      .then(json => res.send(json))
  })
  .post((req, res) => {
    const tweet = req.body.tweet;

    if (!currentLyrics) {
      res.status(400).send('No lyrics selected')
      return;
    }

    // it's a dirty, dirty hack, but I'm not implementing a login for this
    if (!currentLyrics.includes(tweet)) {
      res.status(400).send('Selected lyrics not from currently playing song')
      return;
    }

    console.log(`Posting ${tweet}`)
    twitter.postTweet(tweet)
      .then(resp => resp.json())
      .then(json => res.send(json))
  })

app.listen(process.env.PORT, console.log(`Listening on port ${process.env.PORT}`));