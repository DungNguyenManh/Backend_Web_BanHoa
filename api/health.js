// Simple health check endpoint
module.exports = (req, res) => {
  console.log('Health check called');
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Flower Shop API is running'
  });
};
