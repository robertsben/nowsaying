const http = require('http');
const spotify = require('./modules/spotify');

http.createServer(function (req, res) {
  res.write('Hello World!'); //write a response to the client
  res.write(spotify)
  res.end(); //end the response
}).listen(process.env.PORT);

