`use strict`;

require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const axios = require('axios');
const weather = require('./data/weather.json');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/', (request, response) => {
    response.send('hello')
});

app.get('/weather', weatherHandler);
async function weatherHandler(request,response) {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.searchQuery;
    console.log("lat, lon", lat, lon)
    
  await weather(lat,lon)
    .then(summaries => response.send(summaries))
    .catch(error => {
        console.error(error);
        response.status(500).send('sorry,something went wrong');
    });
};


// create a function to handle errors from any API call.
app.use('*', (request, response) => response.status(404).send('that endpoint does not exsist'));

// tells the express app which port to listen on 
app.listen(PORT, () => console.log(`listening on port ${PORT}`));