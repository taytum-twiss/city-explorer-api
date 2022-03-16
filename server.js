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

// testing the home route to make sure the server is running correctly 
app.get('/', (request, response) => {
    response.send('hello')
});

app.get('/weather', async (request, response) => {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.searchQuery;

    console.log("lat, lon", lat, lon)


    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&days=7&lat=${lat}&lon=${lon}`;
    console.log(url);

    const weatherData = await axios.get(url);
    console.log(weatherData.data.data)
    
    try{
        const weatherArray = weatherData.data.data.map(day => new Forecast(day));
        response.status(200).send(weatherArray); 
    
    } catch(error) {
        //if the user did not serach for one of the three cities that we have information abput (Seattle,Paris, or Amman), return an error.
        console.log(error);
        response.status(500).send('city not found');
    }

})

// create class for `Forecast`, that has properties of `date` and `description`
function Forecast(day) {
    this.day = day.valid_date
    this.description = day.weather.description 
}

// create a function to handle errors from any API call.
app.use('*', (request, response) => response.status(404).send('that endpoint does not exsist'));

// tells the express app which port to listen on 
app.listen(PORT, () => console.log(`listening on port ${PORT}`));