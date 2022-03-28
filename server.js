`use strict`;

// require in our libraries 
require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const axios = require('axios');
const weather = require('./data/weather.json');

// app to use...
const app = express();
app.use(cors());

// set the port variable 
const PORT = process.env.PORT || 3001;

//end points
app.get('/', testingHandler);
app.get('/weather', weatherHandler);
app.use('*', notFoundHandler);

// testing the home route to make sure the server is running correctly 
function testingHandler(request, response) {
    response.send('hello')
};

//create an api endpoint of '/weather' that processes a 'GET' request that contains 'lat', 'lon' and 'searchQuery' information
async function weatherHandler(request, response) {
    let lat = request.query.lat;
    let lon = request.query.lon;
    //let searchQuery = request.query.searchQuery;
    console.log("lat, lon", lat, lon);

    await weather (lat, lon)
    .then(summaries => response.send(summaries))
    .catch(error => {
        console.error(error);
        response.status(500).send('sorry, something went wrong with your weather call');
    });
}

// create a function to handle errors from any API call.
function notFoundHandler(request, response) {
    response,status(404).send('that endpoint does not exist');
}

// tells the express app which port to listen on 
app.listen(PORT, () => console.log(`listening on port ${PORT}`));