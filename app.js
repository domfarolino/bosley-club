const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const LEX = require('letsencrypt-express');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'lib', 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const pages = require('./lib/controllers/pages');

// Routes
app.get('/', pages.index);

const lex = LEX.create({
  configDir: require('os').homedir() + '/letsencrypt/etc',
  approveRegistration: function (hostname, cb) {
    cb(null, {
      domains: [hostname],
      email: 'domfarolino@gmail.com',
      agreeTos: true,
    });
  }
});

lex.onRequest = app;

lex.listen([80], [443, 5001], function () {
  const protocol = ('requestCert' in this) ? 'https': 'http';
  console.log("Listening at " + protocol + '://localhost:' + this.address().port);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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


module.exports = app;
