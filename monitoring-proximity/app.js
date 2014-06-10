var fs = require('fs');
var config = require('./config.js').config;
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// mongo db
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + config.mongodb.host + '/bms_development');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to 'bms_development' database");
});


/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = require('http').createServer(app);
var socketio = require('socket.io');
var io = socketio.listen(server);
var redis = require('redis');
var redisClient = redis.createClient(config.redis.port, config.redis.host);

var monitor = io.of('/monitor').on('connection', function(socket){
});


var Content = require('./models/content');
redisClient.subscribe('discover beacon');
redisClient.on("message", function(channel, beacon) {
    var beaconInfo = JSON.parse(beacon);

    var condition = {
        uuid: beaconInfo.uuid,
        major: beaconInfo.major,
        minor: beaconInfo.minor
    };
    Content.findOne(condition, {name: 1, image_data: 1}, function(err, content){
        if(err || !content) {
          return;
        }
        var data = {
            id: beaconInfo.id.replace(/,/g, '-'),
            name: content.name,
            image_data: content.image_data,
            proximity: beaconInfo.proximity
        };
        if(beaconInfo.proximity === 'notfound'){
            data.image_data = null;
        }

        monitor.emit('message', data);
    });
});

server.listen(3001);

module.exports = app;
