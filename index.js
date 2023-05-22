const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

mongoose.connect('mongodb://localhost/social-network-api', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to the social network API database');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
