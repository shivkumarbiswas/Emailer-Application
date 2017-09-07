var express = require("express");
var routes = require("./routes/index");
var user = require("./routes/user");
var http = require("http");
var path = require("path");
var nodemailer = require("nodemailer");
var logger = require("morgan");
var json = require("json");
var methodOverride = require("method-override");
var morgan = require("morgan");
var url = require("url");
var xoauth2 = require("xoauth2");
var bodyParser = require("body-parser");
var errorHandler = require("errorhandler");
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

if('development' == app.get('env')) {
    app.use(errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/contact', function(req, res) {
    var mailOpts, smtpConfig;
    smtpConfig = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: '',
            pass: ''
        }
    });

    mailOpts = {
        from: req.body.name + '&lt;' + req.body.email + '&gt;',
        to: req.body.email,
        subject: req.body.name,
        text: req.body.message
    };

    smtpConfig.sendMail(mailOpts, function (error, response) {
        if(error) {
            console.log(error);
            res.end("Email send failed");
        }
        else {
            res.end("Email send successfully");
        }
    });
});

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
