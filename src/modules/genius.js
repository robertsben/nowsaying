const fetch = require('node-fetch')
const jsdom = require('jsdom')
const lyrics = require('./lyrics')
const config = require('../config')
const {JSDOM} = jsdom

const geniusApi = `https://api.genius.com`

const searchForLyrics = (term) => {
  return fetch(`${geniusApi}/search?q=${encodeURIComponent(term)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${config.GENIUS_ACCESS_TOKEN}`
    }
  })
}

const requestSong = (path) => {
  return fetch(`${geniusApi}${path}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${config.GENIUS_ACCESS_TOKEN}`
    }
  })
}

const requestLyrics = (url) => {
  return fetch(url, {method: 'GET'});
}

const getSongUrl = (term) => {
  return searchForLyrics(term)
    .then((resp) => resp.json())
    .then((json) => json.response.hits[0].result.api_path)
}

const getSongLyricsUrl = (song_url) => {
  return requestSong(song_url)
    .then((resp) => resp.json())
    .then((json) => json.response.song.url)
}

const getLyrics = (lyrics_url) => {
  return requestLyrics(lyrics_url)
    .then((resp) => resp.text())
    .then((dom) => {
      const {document} = (new JSDOM(dom)).window;
      const lyrics = document.querySelector(".lyrics")
      return lyrics.textContent
    })
}

const getLyricSnippet = (title) => {
  return getSongUrl(title)
    .then(getSongLyricsUrl)
    .then(getLyrics)
    .then(lyrics.cleanLyrics)
    .then(lyrics.chooseRandomSnippet)
}

module.exports = {
  getLyricSnippet: getLyricSnippet
}