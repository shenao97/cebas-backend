const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
const configRoutes = require('./routes/config');
const irrigationRoutes = require('./routes/irrigation');

app.use('/api', configRoutes);
app.use('/api', irrigationRoutes);

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
