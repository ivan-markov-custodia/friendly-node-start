import { useState } from 'react';

const API_KEY = 'aee631b1ce904f589c242927251907'; 

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city) {
      setError('Please enter a city');
      setWeather(null);
      return;
    }

    try {
      const response = await fetch(`/api/v1/current.json?key=${API_KEY}&q=${city}`);
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeather(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h1>Weather App</h1>
      <form onSubmit={fetchWeather} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          style={{ padding: '10px', width: 'calc(100% - 110px)', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Get Weather</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weather && (
        <div>
          <h2>{weather.location.name}, {weather.location.country}</h2>
          <p>Temperature: {weather.current.temp_c}°C</p>
          <p>Condition: {weather.current.condition.text}</p>
          <img src={weather.current.condition.icon} alt={weather.current.condition.text} />
        </div>
      )}
    </div>
  );
}

export default App;
