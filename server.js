'use strict';

// require in our libraries 
require('dotenv').config();
import express from 'express';
import cors from 'cors';
// bring in out weather dummy data
import { find } from './data/weather.json';

// app to use...
const app = express();
app.use(cors());

// set the port variable 
const PORT = process.env.PORT || 3002;

// testing the home route to make sure the server is running correctly 
app.get('/', (request, response) => {
    response.send('hello')
});

// create an API endpoint of '/weather' that processes a "GET" request that contains 'lat', 'lon' and 'searchQuery' information.
app.get('/weather', (request, response) => {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.searchQuery;//city we searched for 

    // use the .find() method the discover which the 'lat', 'lon' and 'searchQuery' information belong to. 
    const city = find(cityObj => cityObj.city_name.toLowerCase() === searchQuery.toLowerCase());

    try {
        // using each data point from the static data of the city that the user searched, create an array of `Forecast` objects, on for each day.
        const weatherArray = city.data.map(day => new Forecast(day));

        // send the full array back to the client who requested data from the `weather` endpoint.
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