// use the express library
const express = require('express');
const fetch = require('node-fetch');
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

app.get("/trivia", async (req, res) => {
    // fetch the data
    const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
  
    // fail if bad response
    if (!response.ok) {
      res.status(500);
      res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
      return;
    }
  
    // interpret the body as json
    const content = await response.json();
  
    // fail if db failed
    if (content.response_code !== 0) {
        res.status(500);
        res.send(`Open Trivia Database failed with internal response code ${content.response_code}`);
        return;
    }
  
    // respond to the browser
    correctAnswer = content.results[0]['correct_answer']
    answers = content.results[0]['incorrect_answers']
    answers.push(correctAnswer)
    let shuffledAnswers = answers.sort(function() {
        return Math.random() - 0.5;
    });
    const answerLinks = shuffledAnswers.map(answer => {
        return `<a style='color:white' href="javascript:alert('${
          answer === correctAnswer ? 'Correct!' : 'Incorrect, Please Try Again!'
          }')">${answer}</a>`
    })
    res.render('trivia', {
        question: content.results[0]['question'],
        category: content.results[0]['category'],
        difficulty: content.results[0]['difficulty'],
        answers: answerLinks
    })
  });

// Start listening for network connections
app.listen(port);
// Printout for readability
console.log("Server Started!");