const express = require('express');
const connectMongoDB = require('./config/mongo-db');
const cors = require('cors');

const menuRoute = require('./routes/api/menus');

require('dotenv').config();

const app = express()
const port = process.env.PORT || 3000;

connectMongoDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Hello world!'));
app.use('/api/menu', menuRoute);

app.listen(
        port, () => console.log(`Server running on port ${port}`)
    );