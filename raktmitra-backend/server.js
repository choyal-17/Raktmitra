const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Mount all routes at root level (matching original Spring Boot routes)
const authRoutes   = require('./routes/auth');
const donorRoutes  = require('./routes/donors');
const patientRoutes = require('./routes/patients');
const bankRoutes   = require('./routes/banks');

app.use('/', authRoutes);
app.use('/', donorRoutes);
app.use('/', patientRoutes);
app.use('/', bankRoutes);

// Health check
app.get('/health', (req, res) => res.json({ message: 'RaktMitra API running ✅' }));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
