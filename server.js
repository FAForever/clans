// server.js

var express = require('express');
var path = require('path');
var app = express();
var PORT = 8080;


app.use(express.static(path.join(__dirname, 'www')));
app.get('*', function(request, response) {
  response.sendFile(__dirname + '/www/index.html');
});

app.listen(PORT, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  }
});
