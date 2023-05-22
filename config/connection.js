const mongoose = require('mongoose');

// MongoDB connection URL
const MONGODB_URI = 'mongodb://localhost/social-network';

// Establish a connection to the MongoDB database
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Get the default connection
const db = mongoose.connection;

// Event handlers for the MongoDB connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database.');
});

module.exports = db;