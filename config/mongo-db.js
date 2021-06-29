const mongoose = require('mongoose');
require('dotenv').config();

const connectMongoDB = async () => {
    const uri = process.env.mongoURI;
    try {
        await mongoose.connect(uri, 
            {
                useUnifiedTopology: true,
                useNewUrlParser: true
            });
            console.log('MongoDB database connection established successfully');
    } catch(err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectMongoDB;