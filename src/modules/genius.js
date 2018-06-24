const fetch = require('node-fetch')
const config = require('../config')

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

const getSongUrl = (term) => {
  return searchForLyrics(term)
    .then((resp) => resp.json())
    .then((json) => json.response.hits[0].result.api_path)
}

const getSongLyrics

const getLyrics = (title) => {

}