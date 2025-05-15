const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Middleware
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
const rateLimiter = require('./middleware/rateLimit');

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimiter); // Apply rate limiting

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Fallback route
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
