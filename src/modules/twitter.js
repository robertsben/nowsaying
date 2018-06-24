const crypto = require('crypto')
const fetch = require('node-fetch')
const config = require('../config')

const TWEET_API = `https://api.twitter.com/1.1/statuses/update.json`

const generateTwitterOAuth = (http_method, http_url, req_params) => {
  let auth = `OAuth `
  const oauthParams = getTwitterOAuthParams(http_method, http_url, req_params)
  Object.keys(oauthParams).forEach(function (key) {
    if (auth != `OAuth `) {
      auth += `, `
    }
    auth += `${encodeRFC5987ValueChars(key)}="${encodeRFC5987ValueChars(oauthParams[key])}"`
  })
  return auth
}

const getTwitterOAuthParams = (http_method, http_url, req_params) => {
  const oauthParams = {
    'oauth_consumer_key': config.TWITTER_CLIENT_ID,
    'oauth_nonce': generateOAuthNonce(),
    'oauth_signature_method': 'HMAC-SHA1',
    'oauth_timestamp': Math.floor(Date.now() / 1000),
    'oauth_token': config.TWITTER_ACCESS_TOKEN,
    'oauth_version': '1.0'
  }
  oauthParams['oauth_signature'] = generateOAuthSignature(http_method, http_url, req_params, oauthParams)

  const sortedOAuthParams = {}
  Object.keys(oauthParams).sort().forEach(function (key) {
    sortedOAuthParams[key] = oauthParams[key]
  })

  return sortedOAuthParams
}

const generateOAuthNonce = () => {
  const nonceLen = 32;
  return crypto.randomBytes(Math.ceil(nonceLen * 3 / 4))
    .toString('base64')   // convert to base64 format
    .slice(0, nonceLen)        // return required number of characters
    .replace(/\+/g, '0')  // replace '+' with '0'
    .replace(/\//g, '0');
}

const generateSigningKey = () => {
  return `${encodeRFC5987ValueChars(config.TWITTER_CLIENT_SECRET)}&${encodeRFC5987ValueChars(config.TWITTER_ACCESS_TOKEN_SECRET)}`
}

/**
 * @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
 * @param str
 * @returns {string}
 */
function encodeRFC5987ValueChars(str) {
  return encodeURIComponent(str).
    // Note that although RFC3986 reserves "!", RFC5987 does not,
    // so we do not need to escape it
    replace(/['()*]/g, c => "%" + c.charCodeAt(0).toString(16)). // i.e., %27 %28 %29 %2A
    // The following are not required for percent-encoding per RFC5987,
    // so we can allow for a little better readability over the wire: |`^
    replace(/%(7C|60|5E)/g, (str, hex) => String.fromCharCode(parseInt(hex, 16)));
}

const generateOAuthSignature = (
  http_method,
  http_url,
  req_parameters,
  oauth_parameters
) => {
  const allParams = {...req_parameters, ...oauth_parameters}
  // encode
  const encodedParams = {}
  Object.keys(allParams).forEach(function(key) {
    encodedParams[encodeRFC5987ValueChars(key)] = encodeRFC5987ValueChars(allParams[key])
  })

  // order
  const ordered = {}
  Object.keys(encodedParams).sort().forEach(function(key) {
    ordered[key] = encodedParams[key];
  });

  let parameter_string = ``
  Object.keys(ordered).forEach(function(key) {
    if (parameter_string != ``) {
      parameter_string += `&`
    }
    parameter_string += `${key}=${ordered[key]}`
  })

  const sig_base_string = `${http_method}&${encodeRFC5987ValueChars(http_url)}&${encodeRFC5987ValueChars(parameter_string)}`
  const sig_signing_key = generateSigningKey()
  return crypto.createHmac('SHA1', sig_signing_key).update(sig_base_string).digest('base64')
}

const postTweet = (tweet) => {
  const method = 'POST'
  const rawParams = {'status': tweet}
  const oauth = generateTwitterOAuth(method, TWEET_API, rawParams, {})

  const params = new URLSearchParams()
  Object.keys(rawParams).forEach(key => {
    params.append(key, rawParams[key])
  })

  return fetch(`${TWEET_API}`, {
    'method': method,
    body: params,
    headers: {
      'Authorization': oauth,
      'Content-Type': `application/x-www-form-urlencoded`
    }
  })
}

module.exports = {
  postTweet: postTweet
}