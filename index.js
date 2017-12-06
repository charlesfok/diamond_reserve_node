var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.use('/api/diamonds', require('./diamond'));
app.use('/api/users', require('./user'));
app.use('/api/reservations', require('./reservation'));

app.get('/', function(req, res) {
  res.send('Hello World!')
})

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});


// Basic error handler
app.use((err, req, res, next) => {

  console.error(err);
  err.response = {
    message: err.message,
    internalCode: err.code
  };
  res.status(500).send(err.response || 'Something broke!');
});


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
