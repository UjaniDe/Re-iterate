// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Reiterate backend OK'));

// quick test endpoint
app.post('/api/experiments/run', (req, res) => {
  const { basePrompt } = req.body || {};
  return res.json({
    ok: true,
    message: 'This is a mocked response from backend',
    data: {
      basePrompt: basePrompt || null,
      variants: [
        { id: 'v1', prompt: 'Mock variant 1', response: 'Mock answer 1' },
        { id: 'v2', prompt: 'Mock variant 2', response: 'Mock answer 2' },
        { id: 'v3', prompt: 'Mock variant 3', response: 'Mock answer 3' }
      ]
    }
  });
});

const PORT = process.env.PORT || 5001;
const MONGO = process.env.MONGO_URI;

// Helper to start server (used whether or not Mongo connects)
function startServer() {
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
}

// If MONGO_URI is set, try to connect, but don't crash on failure.
// replace your existing if (MONGO) { ... } block with this
if (MONGO) {
  mongoose.connect(MONGO)
    .then(() => {
      console.log('MongoDB connected');
      startServer();
    })
    .catch((err) => {
      console.error('MongoDB connection error (continuing without DB):', err.message || err);
      startServer();
    });
} else {
  console.log('MONGO_URI not set — starting server without DB connection');
  startServer();
}

