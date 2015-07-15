var
express     = require('express'),
routes      = require('./routes'),
http        = require('http'),
app         = express(),
fs          = require('fs');

// -- Configuration --
app.configure(function () {
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));

});
app.get('/', function(req, res) {
    fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.get('/send',routes.getData);

app.get('/details',routes.getDetails);


//app.listen(2000);

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

console.log('Listening on server 2000');

