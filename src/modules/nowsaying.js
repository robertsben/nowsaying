const spotify = require('./spotify')
const genius = require('./genius')
const twitter = require('./twitter')

const pad = (num) => num < 10 ? `0${num}`: `${num}`;

const getNowPlaying = () => {
  return spotify.getNowPlaying()
}

const getNowPlayingDetails = () => {
  return getNowPlaying()
    .then(nowPlaying => {
      const item = nowPlaying.item;
      const name = item.name
      const url = item.external_urls.spotify
      const artist = item.artists[0].name
      const album = item.album;
      const track_no = item.track_number;
      const length_ms = item.duration_ms;
      const art = Array.isArray(album.images) && album.images.length > 0 ? album.images[0].url : '';

      const seconds = parseInt((length_ms/1000)%60)
        , minutes = parseInt((length_ms/(1000*60))%60)
        , hours = parseInt((length_ms/(1000*60*60))%24);
      const nomal_len = `${pad(minutes)}:${pad(seconds)}`
      const length = hours > 0 ? `${pad(hours)}${nomal_len}` : nomal_len;

      return {
        song: name,
        artist: artist,
        album: album,
        art: art,
        track_no: track_no,
        length: length,
        url: url
      }
    })
}

const getLyricsFromSongArtist = (info) => {
  return genius.getLyricSnippet(`${info.song} ${info.artist}`);
}

const getFullLyricsFromSongArtist = (info) => {
  return genius.getLyricsFull(`${info.song} ${info.artist}`);
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
  return getLyricsFromNowPlaying()
    .then((lyrics) => {
      console.log(`Found lyric snippet: ${lyrics}`)
      return lyrics
    })
    .then(twitter.postTweet)
}

module.exports = {
  getNowPlaying: getNowPlaying,
  getNowPlayingDetails: getNowPlayingDetails,
  getLyricsFromNowPlaying: getLyricsFromNowPlaying,
  getLyricsFromSongArtist: getLyricsFromSongArtist,
  getFullLyricsFromSongArtist: getFullLyricsFromSongArtist,
  tweetNowPlaying: tweetNowPlaying
}