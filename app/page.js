'use client';

import { useState } from 'react';

const API_KEY = 'aee631b1ce904f589c242927251907'; 

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [protectedData, setProtectedData] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setProtectedData('');

    try {
      const response = await fetch('/auth-api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const { token } = await response.json();

      const protectedResponse = await fetch('/auth-api/protected', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!protectedResponse.ok) {
        throw new Error('Failed to fetch protected data.');
      }

      const data = await protectedResponse.text();
      setProtectedData(data);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city) {
      setError('Please enter a city');
      setWeather(null);
      return;
    }

    try {
      const response = await fetch(`/api/weather/v1/current.json?key=${API_KEY}&q=${city}`);
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
      <h1>Login</h1>
      <form onSubmit={handleLogin} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={{ padding: '10px', width: 'calc(50% - 60px)', marginRight: '10px' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ padding: '10px', width: 'calc(50% - 60px)', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Login</button>
      </form>
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
      {protectedData && (
        <div>
          <h3>Protected Data:</h3>
          <p>{protectedData}</p>
        </div>
      )}
      <hr style={{ margin: '20px 0' }} />
      <div style={{ textAlign: 'center' }}>
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
            <h2 style={{ color: 'red' }}>{weather.location.name}, {weather.location.country}</h2>
            <p style={{ color: 'blue' }}>Temperature: {weather.current.temp_c}°C</p>
            <p style={{ color: 'green' }}>Condition: {weather.current.condition.text}</p>
            <img src={weather.current.condition.icon} alt={weather.current.condition.text} />
          </div>
        )}
      </div>
    </div>
  );
}