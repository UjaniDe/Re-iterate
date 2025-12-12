// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Reiterate backend OK'));

const experimentsRouter = require('./src/routes/experiments');
app.use('/api/experiments', experimentsRouter);

const PORT = process.env.PORT || 5001;
const MONGO = process.env.MONGO_URI;

// Helper to start server
function startServer() {
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
}

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
