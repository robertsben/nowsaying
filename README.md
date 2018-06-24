# nowsaying
A small app that will tweet some random lyrics from whatever you're currently playing on spotify.

Requires a spotify account, a genius developer account, and a twitter accuont to post to.



## Spotify Auth
[docs](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow)

In your spotify developer account you'll need to get a client id and secret.
Once you've set up a site, make sure you add your intended redirect uri to the settings of that site on your spotify developer dashboard.
You'll then be able to get a refreshable token from the app.

The authorization with scopes is performed via the `/login` endpoint.
This will return a refreshable token in the response printed to the page.

You can then use this to request other stuff from the spotify apis.

## Genius Auth
[docs](https://docs.genius.com/#/getting-started-h1)

Sign up for a genius account and get a client id, secret, and access token.

This can then be used to access genius APIs. The lyrics come from accessing the web page directly, as there is no lyrics API.

## Twitter Auth
[docs](https://developer.twitter.com/en/docs/basics/authentication/guides/authorizing-a-request)

In your twitter account you'll need to get a client id and secret, and an access token and secret.
Set up a new app at [app.twitter.com](https://apps.twitter.com) on the account you want to tweet with
and generate a new access token. Make sure it has read and write access.

This can be used to interact with the twitter APIs.
