
const dotenv = require('dotenv');
const cors = require('cors');
var path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios');
const app = express();


dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));

let projectData = {
    trips: []
};

const port = 8090;
const server = app.listen(port, listening);

function listening() {
    console.log(`running on localhost: ${port}`);
};

//get coordinates by city name
app.get('/city/geodata/:cityName', async (req, res) => {
    var username = process.env.GEONAMES_USERNAME;
    console.log(`I was called`);
    const cityName = req.params.cityName;
    const url = `http://api.geonames.org/searchJSON?q=${cityName}&username=${username}`;
    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else if (error.request) {
            res.status(500).send({ message: "No response received from the API" });
        } else {
            res.status(500).send({ message: "Error", error: error.message });
        }
    }
});

//get weather by coordinates
app.get('/city/weather', async(req, res) => {
    var apikey = process.env.WETHERBIT_API_KEY;
    const { lat, lng, countryName } = req.query;
    console.log(`Received request for weather data at ${lat}, ${lng} in ${countryName}`);
    const url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=${apikey}&include=daily`;
    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else if (error.request) {
            res.status(500).send({ message: "No response received from the API" });
        } else {
            res.status(500).send({ message: "Error", error: error.message });
        }
    }

});

//get city image by city name 
app.get('/city/image/:cityName', async (req, res) => {
    const cityName = req.params.cityName;
    var apiKey = process.env.PIXABAY_API_KEY
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(cityName)}&image_type=photo&order=popular&per_page=3`;

    try {
        const response = await axios.get(url);
        if (response.data.hits.length > 0) {
            res.json(response.data.hits); // Send back the array of images
        } else {
            res.status(404).send('No images found');
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).send('Error fetching images');
    }
});

app.post('/trip', (req, res) => {
    const tripInfo = req.body;
    if (!tripInfo) {
        res.status(400).send('No trip data provided');
        return;
    }
    projectData.trips.push(tripInfo); // Save the trip data
    console.log(tripInfo);
    res.status(200).send('Trip info added successfully');
});




