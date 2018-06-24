const fetch = require('node-fetch');
const config = require('../config');

const spotifyAccountsDomain = `https://accounts.spotify.com`
const spotifyTokenApi = `/api/token`
const spotifyApi = `https://api.spotify.com`
const spotifyCurrentlyPlayingApi = `/v1/me/player/currently-playing`
const spotifyNowPlayingScopes = `user-read-currently-playing user-read-playback-state`
const spotifyAuthorizeApi = `${spotifyAccountsDomain}/authorize?client_id=${config.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(config.SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(spotifyNowPlayingScopes)}`

const basicAuthId = () => {
  return new Buffer.from(`${config.SPOTIFY_CLIENT_ID}:${config.SPOTIFY_CLIENT_SECRET}`).toString(`base64`);
}

const requestToken = (params) => {
  return fetch(`${spotifyAccountsDomain}${spotifyTokenApi}`, {
    method: `POST`,
    body: params,
    headers: {
      'Authorization': `Basic ${basicAuthId()}`,
      'Content-Type': `application/x-www-form-urlencoded`
    }
  });
}

const requestRefreshableAccessToken = (code) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code')
  params.append('code', code)
  params.append('redirect_uri', config.SPOTIFY_REDIRECT_URI)

  return requestToken(params)
}

const requestAccessToken = () => {
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', config.SPOTIFY_REFRESH_TOKEN)

  return requestToken(params)
}

const requestNowPlaying = (access_token) => {
  return fetch(`${spotifyApi}${spotifyCurrentlyPlayingApi}`, {
    method: `GET`,
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  })
}

const getNowPlaying = () => {
  return requestAccessToken()
    .then((resp) => resp.json())
    .then((resp_json) => resp_json['access_token'])
    .then(requestNowPlaying)
    .then((resp) => resp.json())
}

module.exports = {
  getNowPlaying: getNowPlaying,
  spotifyAuthorizeApi: spotifyAuthorizeApi,
  requestRefreshableAccessToken: requestRefreshableAccessToken
}