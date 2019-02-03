// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var _ = require('lodash');
var cors = require('cors');

app.use(cors());

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// DATABASE SETUP
var mongoose = require('mongoose');
mongoose.connect('mongodb://vittaljk:way22sms@ds119795.mlab.com:19795/green-story'); // connect to our database

// Handle the connection event
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
	console.log("DB connection alive");
});

var Event = require('./app/models/event');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
	// do logging
	console.log('middleware logging.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
	res.json({
		message: 'hooray! welcome to our api!'
	});
});

router.route('/events')

    // get all events endpoint
    .get(function (req, res) {
        Event.find(function (err, events) {
            if (err) {
                res.send(err);
            }
            events = _.groupBy(events, 'day')
            res.json(events);
        });
    })

    // add event endpoint
	.post(function (req, res) {

		var event = new Event();
		event.name = req.body.name;
		event.day = req.body.day;

		event.save(function (err) {
			if (err)
				res.send(err);

			res.json({
				message: 'event created!'
			});
		});


    })

router.route('/events/:id')

    // update event endpoint
    .put(function (req, res) {
        Event.findById(req.params.id, function (err, event) {

            if (err)
                res.send(err);

            event.name = req.body.name;
            event.save(function (err) {
                if (err)
                    res.send(err);

                res.json({
                    message: 'Event updated!'
                });
            });

        });
    })

    // delete event endpoint
    .delete(function (req, res) {
        Event.remove({
            _id: req.params.id
        }, function (err, event) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully deleted'
            });
        });
    });

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
