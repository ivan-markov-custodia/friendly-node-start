const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.WEATHER_API_KEY;

app.get('/weather/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({ message: 'Error from WeatherAPI', error: error.response.data });
        } else {
            res.status(500).json({ message: 'Error fetching current weather', error: error.message });
        }
    }
});

app.get('/forecast/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7`);
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({ message: 'Error from WeatherAPI', error: error.response.data });
        } else {
            res.status(500).json({ message: 'Error fetching forecast', error: error.message });
        }
    }
});

let favorites = [];

app.post('/favorites', (req, res) => {
    const { city } = req.body;
    if (city && !favorites.includes(city)) {
        favorites.push(city);
        res.status(201).json({ message: 'City added to favorites', favorites });
    } else {
        res.status(400).json({ message: 'City already in favorites or invalid city' });
    }
});

app.get('/favorites', (req, res) => {
    res.json(favorites);
});

app.delete('/favorites/:city', (req, res) => {
    const { city } = req.params;
    favorites = favorites.filter(favCity => favCity.toLowerCase() !== city.toLowerCase());
    res.json({ message: 'City removed from favorites', favorites });
});


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
}); 