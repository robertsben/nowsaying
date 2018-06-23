

## Spotify Auth
[docs](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow)

In your spotify developer account you'll need to get a client id and secret.
Once you've set up a site, make sure you add your intended redirect uri to the settings of that site on your spotify developer dashboard.
You'll then be able to get a refreshable token from the app.

The authorization with scopes is performed via the `/login` endpoint.
This will return a refreshable token in the response printed to the page.

You can then use this to request other stuff from the spotify apis.
