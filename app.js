'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const logger = require('morgan');
const handlebars = require('handlebars');
const bodyParser = require('body-parser');
const LEX = require('letsencrypt-express');
const cookieParser = require('cookie-parser');

const express = require('express');
const app = express();

// Simple helper for SSR template logic
handlebars.registerHelper('ifNotEqual', function (a, b, opts) {
  if (a !== b) {
    console.log(a, b);
    return opts.fn(this);
  }
});

// Middleware setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Custom * hanlder for custom Cache-Control
app.get('*', (request, response, next) => {
  response.set({
    'Cache-Control': 'no-cache'
  });

  // Remove bs headers
  response.removeHeader('X-Powered-By');

  // Move on down the line
  next();
});

/**
 * Server side rendering bit for our views
 * We want to SSR anything paths like `/` `/anything/` `../index.html`
 */
app.get(/([^/]*)(\/|\/index.html)$/, (request, response) => {
  request.requestedPage = request.params[0] || '';

  let files = [];
  if ('partial' in request.query) {
    files = [fs.readFileSync(`public/${request.requestedPage}/index.html`, 'utf-8')]
  } else {
    files = [
      fs.readFileSync('./public/header.partial.html', 'utf-8'),
      fs.readFileSync(`public/${request.requestedPage}/index.html`, 'utf-8'),
      fs.readFileSync('public/footer.partial.html', 'utf-8')
    ];
  }

  const compiledFiles = files.map(file => handlebars.compile(file.toString())(request));
  const pageContent = compiledFiles.join('');

  response.set({
        'ETag': crypto.createHash('md5').update(pageContent).digest('hex')
      }).send(pageContent);
});

/**
 * API setup
 */

const apiV1 = require('./lib/controllers/api/v1');

app.get('/api/v1*', apiV1.apiMiddleware); // Sets headers for every API route and calls .next()
app.get('/api/v1', apiV1.index);
app.use('/', express.static(path.join(__dirname, 'public')));

/**
 * Letsencrypt and other stuff below
 */

const lex = LEX.create({
  server: 'staging',
  //configDir: require('os').homedir() + '/letsencrypt/etc',
  configDir: '/etc/letsencrypt',
  approveDomains: approveDomains
});

function approveDomains(opts, certs, cb) {
  // This is where you check your database and associated
  // email addresses with domains and agreements and such

  // The domains being approved for the first time are listed in opts.domains
  // Certs being renewed are listed in certs.altnames
  if (certs) {
    opts.domains = certs.altnames;
  } else {
    opts.email = 'domfarolino@gmail.com';
    opts.agreeTos = true;
  }

  // NOTE: you can also change other options such as `challengeType` and `challenge`
  // opts.challengeType = 'http-01';
  // opts.challenge = require('le-challenge-fs').create({});

  cb(null, { options: opts, certs: certs });
}

lex.onRequest = app;

require('http').createServer(lex.middleware(app)).listen(process.env.SERVE_PORT, function () {
  console.log("Listening for ACME http-01 challenges on", this.address());
});

require('https').createServer(lex.httpsOptions, lex.middleware(app)).listen(443, function () {
  console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
