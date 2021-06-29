const express = require('express');
const connectMongoDB = require('./config/mongo-db');
const cors = require('cors');

require('dotenv').config();

const app = express()
const port = process.env.PORT || 3000;

connectMongoDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ extended: false }));

app.listen(
        port, () => console.log(`Server running on port ${port}`)
    );