import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState('');

    const getWeatherData = async (searchCity) => {
        try {
            const { data } = await axios.get(`http://localhost:5000/weather/${searchCity}`);
            setWeather(data);
            setError('');
        } catch (err) {
            setError('City not found or error fetching data.');
            setWeather(null);
        }
    };

    const getFavorites = async () => {
        const { data } = await axios.get('http://localhost:5000/favorites');
        setFavorites(data);
    };

    useEffect(() => {
        // Fetch weather for user's location on initial load
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                // This requires a reverse geocoding service to get city from lat/lon
                // For simplicity, we'll use a default city
                getWeatherData('London'); 
            });
        }
        getFavorites();
    }, []);
    
    useEffect(() => {
      const interval = setInterval(() => {
          favorites.forEach(favCity => getWeatherData(favCity));
      }, 600000); // Auto-refresh every 10 minutes
      return () => clearInterval(interval);
    }, [favorites]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (city) {
            getWeatherData(city);
        }
    };

    const addToFavorites = async () => {
        if (weather) {
            await axios.post('http://localhost:5000/favorites', { city: weather.location.name });
            getFavorites();
        }
    };

    const removeFromFavorites = async (favCity) => {
        await axios.delete(`http://localhost:5000/favorites/${favCity}`);
        getFavorites();
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">WeatherTrackr</h1>

            <form onSubmit={handleSearch} className="w-full max-w-sm flex mb-8">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Search for a city"
                    className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-md">Search</button>
            </form>

            {error && <p className="text-red-500">{error}</p>}

            {weather && (
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">{weather.location.name}</h2>
                            <p className="text-gray-600">{weather.location.country}</p>
                        </div>
                        <button onClick={addToFavorites} className="text-yellow-400 text-2xl">⭐</button>
                    </div>
                    <div className="flex items-center justify-center mt-4">
                        <img src={weather.current.condition.icon} alt={weather.current.condition.text} className="w-20 h-20" />
                        <div className="ml-4">
                            <p className="text-5xl font-bold">{weather.current.temp_c}°C</p>
                            <p className="text-gray-500">{weather.current.condition.text}</p>
                        </div>
                    </div>
                    <div className="flex justify-around mt-6 text-center">
                        <div>
                            <p className="font-semibold">Wind</p>
                            <p>{weather.current.wind_kph} kph</p>
                        </div>
                        <div>
                            <p className="font-semibold">Humidity</p>
                            <p>{weather.current.humidity}%</p>
                        </div>
                        <div>
                            <p className="font-semibold">Feels Like</p>
                            <p>{weather.current.feelslike_c}°C</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-4xl">
                <h3 className="text-2xl font-bold mb-4">Favorites</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {favorites.map(favCity => (
                        <div key={favCity} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                            <span className="font-semibold">{favCity}</span>
                            <button onClick={() => removeFromFavorites(favCity)} className="text-red-500">🗑️</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
