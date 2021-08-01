const express = require('express');
const cookieParser = require('cookie-parser')
const connectMongoDB = require('./config/mongo-db');
const cors = require('cors');

const menuRoutes = require('./routes/api/menus');
const userRoutes = require('./routes/api/user');

require('dotenv').config();

const app = express()
app.use(cookieParser())
const port = process.env.PORT || 3000;

connectMongoDB();

corsOrigin = ['http://127.0.0.1:3000/', 'http://127.0.0.1:4200']
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Hello world!'));
app.use('/api/menus', menuRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));

 // The module “body-parser” enables reading (parsing) HTTP-POST data.
 // Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
 // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files