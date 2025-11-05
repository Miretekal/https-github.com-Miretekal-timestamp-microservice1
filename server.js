const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS enabled
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static files
app.use(express.static('public'));

// Main route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// API endpoint - THIS IS THE FIXED VERSION
app.get('/api/:date?', (req, res) => {
  let dateString = req.params.date;
  
  // If no date provided, return current time
  if (!dateString) {
    const currentDate = new Date();
    return res.json({
      unix: currentDate.getTime(),
      utc: currentDate.toUTCString()
    });
  }
  
  // Check if it's a Unix timestamp (all digits)
  if (/^\d+$/.test(dateString)) {
    const date = new Date(parseInt(dateString));
    return res.json({
      unix: date.getTime(),
      utc: date.toUTCString()
    });
  }
  
  // Try parsing as a date string
  const date = new Date(dateString);
  
  // If invalid date, return error
  if (date.toString() === 'Invalid Date') {
    return res.json({ error: "Invalid Date" });
  }
  
  // Return valid date
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
