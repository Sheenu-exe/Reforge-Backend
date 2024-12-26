// server.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const habitRoutes = require('./routes/habits');
const todoRoutes = require('./routes/todo'); 
const taskRoutes = require('./routes/tasks'); // Added taskRoutes

// Load environment variables
dotenv.config();

const app = express();

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://reforge-gamma.vercel.app']
  : ['http://localhost:3000', 'https://reforge-gamma.vercel.app'];


  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection with error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://pariharsachin5002:<8668369314>@reforgedatabase.5ckzo.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Successfully connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Error handling for subsequent MongoDB errors
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/habits', habitRoutes);
app.use('/api/todos', todoRoutes);  // Changed to todos
app.use('/api/tasks', taskRoutes);
// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Todo and Habit Tracker Backend!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});