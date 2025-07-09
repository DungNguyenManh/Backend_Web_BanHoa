// Simple express app for Vercel
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Simple routes
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Flower Shop API is running'
  });
});

app.get('/api/v1/flowers', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Flowers endpoint working'
  });
});

app.all('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method
  });
});

module.exports = app;
