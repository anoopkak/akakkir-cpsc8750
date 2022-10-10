// use the express library
const express = require('express');

// create a new server application
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;

let nextVisitorId = 1;
// The main page of our website
app.get('/', (req, res) => {
    cookie = req.cookies;
    console.log(cookie)
    visitorId = cookie['visitorId'] != null ? cookie['visitorId'] : nextVisitorId++;
    res.cookie('visitorId', visitorId);
    res.cookie('visited', Date.now().toString());
    res.render('welcome', {
        name: req.query.name || "World",
        date: new Date().toLocaleString(),
        visitorId: visitorId,
        str: cookie['visited'] == null ? "You have never visited" : "It has been " +
            Math.round((Date.now() - new Date(parseInt(cookie["visited"]))) / 1000) + " seconds since your last visit"
    });
});

// Start listening for network connections
app.listen(port);
// Printout for readability
console.log("Server Started!");