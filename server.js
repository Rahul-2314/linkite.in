require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const linkRoutes = require('./routes/linkRoutes');
const userRoutes = require('./Auth/routes/UserRoutes');
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// deployment purpose
// const { fileURLToPath } = require("url");

// const _filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(_filename);
console.log(__dirname);


// use the client app
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/client/dist/index.html')))
// ----------------------------------------

// env load
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// routes
app.use('/', linkRoutes);
app.use('/user', userRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/securelink')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
