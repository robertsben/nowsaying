const spotify = require('./spotify')
const genius = require('./genius')
const twitter = require('./twitter')


const getNowPlaying = () => {
  spotify.getNowPlaying()
    .catch((err) => res.status(500).send(`Error getting now playing: ${err}`))
}

const getLyricsFromNowPlaying = () => {
  return getNowPlaying()
    .then((nowPlaying) => {
      const songName = nowPlaying.item.name
      const artist = nowPlaying.item.artists[0].name
      const query = `${songName} ${artist}`
      console.log(`Querying for: ${query}`)
      return query
    })
    .then(genius.getLyricSnippet)
}

const tweetNowPlaying = () => {
  getLyricsFromNowPlaying()
    .then((lyrics) => {
      console.log(`Found lyric snippet: ${lyrics}`)
      return lyrics
    })
    .then(twitter.postTweet)
}

module.exports = {
  getNowPlaying: getNowPlaying,
  getLyricsFromNowPlaying: getLyricsFromNowPlaying,
  tweetNowPlaying: tweetNowPlaying
}