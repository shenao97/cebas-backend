const express = require('express');
const cors = require('cors');
const { specs, swaggerUi } = require("./docs/Swagger");
const { connectDb } = require('./db/Db');
require('dotenv').config();

const configRoutes = require('./routes/config');
const irrigationRoutes = require('./routes/irrigation');
const loginRoutes = require('./routes/login');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors()); 


connectDb();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/login', loginRoutes);
app.use('/api/config', configRoutes);
app.use('/api/irrigation', irrigationRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
