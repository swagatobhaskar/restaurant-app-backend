const express = require('express');
const cookieParser = require('cookie-parser')
const connectMongoDB = require('./config/mongo-db');
const cors = require('cors');

// bind the authMiddleware as application-level middleware as it is used in every model
const authJWTMiddleware = require('./utils/middlewares');
const menuRoutes = require('./routes/api/menus');
const userRoutes = require('./routes/api/user');

require('dotenv').config();

const app = express()
app.use(cookieParser());
app.use(express.json({ extended: false }));
const port = process.env.PORT || 3000;

connectMongoDB();

app.use(authJWTMiddleware);

app.use(cors({ origin: true, credentials: true }));

app.get('/', (req, res) => res.send('Hello world!'));
app.use('/api/menus', menuRoutes);

// use the router and 401 anything falling through
app.use('/api/users', userRoutes, function (req, res) {
    res.sendStatus(401)
});

app.listen(port, () => console.log(`Server running on port ${port}`));

 // The module “body-parser” enables reading (parsing) HTTP-POST data.
 // Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
 // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files