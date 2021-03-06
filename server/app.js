var path = require('path');
var express = require('express');
var FlashCardModel = require('./models/flash-card-model');
var bodyParser = require('body-parser')

var app = express(); // Create an express app!
module.exports = app; // Export it so it can be require('')'d

// The path of our public directory. ([ROOT]/public)
var publicPath = path.join(__dirname, '../public');

// The path of our index.html file. ([ROOT]/index.html)
var indexHtmlPath = path.join(__dirname, '../index.html');

// http://nodejs.org/docs/latest/api/globals.html#globals_dirname
// for more information about __dirname

// http://nodejs.org/api/path.html#path_path_join_path1_path2
// for more information about path.join

// When our server gets a request and the url matches
// something in our public folder, serve up that file
// e.g. angular.js, style.css
app.use(express.static(publicPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// If we're hitting our home page, serve up our index.html file!
app.get('/', function (req, res) {
    res.sendFile(indexHtmlPath);
});

app.get('/cards', function (req, res, next) {

    var modelParams = {};

    if (req.query.category) {
    	modelParams.category = req.query.category;
    }

    FlashCardModel.find(modelParams, function (err, cards) {
        if (err) return next(err);
        setTimeout(function () {
            res.send(cards);
        }, Math.random() * 1000);
    });
});

app.post('/cards', function (req,res,next) {
    var newCard = req.body;
    FlashCardModel.create(newCard)
    .then(function (card) {
        res.json(card);
    })
    .then(null, next)
})

app.get('/edit/:_id', function(req, res, next){
    console.log("in edit route")
    console.log("req.params._id: ", req.params._id)
    FlashCardModel.findById(req.params._id)
    .exec()
    .then(function(card) {
        res.json(card);
    })
    .then(null,next)
})

app.put('/edit/:flashCardId', function(req, res, next){
    FlashCardModel.findByIdAndUpdate({id: req.params.flashCardId}, req.body)
    .exec()
    .then(function(card) {
        console.log("updated!")
        res.json(card);
    })
    .then(null,next)
})