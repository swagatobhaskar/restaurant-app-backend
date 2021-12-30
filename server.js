const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc'); 
const connectMongoDB = require('./config/mongo-db');

// bind the authMiddleware as application-level middleware as it is used in every model
const Middleware = require('./utils/middlewares');
const menuRoutes = require('./routes/api/menus');
const userRoutes = require('./routes/api/user');
const orderRoutes = require('./routes/api/order');

require('dotenv').config();

const app = express()

app.use(cors());
app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000"); //decide later
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.json({ extended: false }));

const port = process.env.PORT || 3001;

connectMongoDB();

app.use(Middleware.authJWTMiddleware);
app.use(Middleware.logVisit);

app.use(cors({ origin: true, credentials: true }));

app.get('/', (req, res) => res.send('Hello world!'));
app.use('/api/menus', menuRoutes);

// use the router and 401 anything falling through
app.use('/api/users', userRoutes, function (req, res) {
    res.sendStatus(401)
});

app.use('/api/order', orderRoutes);


const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.1.0',
        info: {
            title: 'Restaurant Site',
            version: '1.0.0',
            description: "This is a simple CRUD API application made with Express and documented with Swagger",
            license: 'none',
            contact: {
                name: "Swagato Bhaskar",
                email: "bhaskarsw@outlook.com"
            },
            servers: [
                {
                    url: 'http://127.0.0.1:3001',
                },
            ],
        },
    },
    apis: ["/routes/api/menus.js",],
};
const specs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {explorer: true}));

app.listen(port, () => console.log(`Server is listening on port ${port}`));

 // The module “body-parser” enables reading (parsing) HTTP-POST data.
 // Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
 // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files
