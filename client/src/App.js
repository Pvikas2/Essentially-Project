import React, { useState } from 'react';
import './App.css';

function App() {
  const [symbol, setSymbol] = useState('');
  const [date, setDate] = useState('');
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!symbol || !date) {
      setError('Please enter both the stock symbol and date.');
      return;
    }

    setError(null);

    try {
      const response = await fetch('/api/fetchStockData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ symbol, date })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        setStockData(null);
        return;
      }

      const data = await response.json();
      setStockData(data);
    } catch (error) {
      setError('Failed to fetch data. Please try again later.');
      setStockData(null);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">Stock Data Form</h1>
        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="symbol" className="label">Stock Symbol:</label>
          <input type="text" id="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="input" required />

          <label htmlFor="date" className="label">Select Date:</label>
          <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" required />

          <button type="submit" className="button">Submit</button>
        </form>

        {error && <p className="error">{error}</p>}

        {stockData && (
          <div className="stock-details">
            <h2 className="details-title">Stock Details</h2>
            <ul className="details-list">
              <li className="details-item">Open: {stockData.Open}</li>
              <li className="details-item">High: {stockData.High}</li>
              <li className="details-item">Low: {stockData.Low}</li>
              <li className="details-item">Close: {stockData.Close}</li>
              <li className="details-item">Volume: {stockData.Volume}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
