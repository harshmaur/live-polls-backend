var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var axios = require('axios');
var Slack = require('slack-node');
var app = express();

const slack = new Slack();
slack.setWebhook("https://hooks.slack.com/services/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");


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/$', function (req, res, next) {
  res.render('index', { title: 'Live Polls' });
})

app.use('/login', function (req, res, next) {
  res.render('login', {});
})

app.use('/dashboard', function (req, res, next) {
  res.render('dashboard', {});
})

app.use('/create', function (req, res, next) {
  res.render('create', {})
})

app.post('/paymentComplete', (req, res, next) => {



  var isProduction = false;

  var strSimulator = "https://www.sandbox.paypal.com/cgi-bin/webscr";
  var strLive = "https://www.paypal.com/cgi-bin/webscr";
  var paypalURL = strSimulator;

  if (isProduction) paypalURL = strLive;

  var payload = "cmd=_notify-validate&" + req.body;
  payload = payload.replace("+", "%2B");

  var options =
    {
      "method": "post",
      "payload": payload,
    };

  var resp = UrlFetchApp.fetch(paypalURL, options); //Handshake with PayPal - send acknowledgement and get VERIFIED or INVALID response

  if (resp == 'VERIFIED') {
    if (e.parameter.payment_status == 'Completed') {
      if (e.parameter.receiver_email == 'receiver@email.com') {
        //Implement paid amount validation. If accepting payments in multiple currencies, use e.parameter.exchange_rate to convert to reference currency (USD) if paid in any other currency
        if (amountValid) {

          //All validated - can process the payment here

          if (!(processSuccess)) {
            //Process of payment failed - raise notification to check it out
          }
        } else {
          //Payment does not equal expected purchase value
        }
      } else {
        //Request did not originate from my PayPal account 
      }
    } else {
      //Payment status not Completed 
    }
  } else {
    //PayPal response INVALID 
  }




  slack.webhook({
    username: "webhookbot",
    text: `${JSON.stringify(req.query)} \n ${JSON.stringify(req.body)} \n ${JSON.stringify(req.params)}`
  }, () => { });
  res.status(200).send({});
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
