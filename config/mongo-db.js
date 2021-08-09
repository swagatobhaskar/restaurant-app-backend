const mongoose = require('mongoose');
require('dotenv').config();

const connectMongoDB = async () => {
    const uri = process.env.mongoURI;
    try {
        await mongoose.connect(uri, 
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                // added as this error was showing:
                // (node:19932) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
                useCreateIndex: true,
                useFindAndModify: false
            });
            console.log('MongoDB database connection established successfully');
            
    } catch(err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectMongoDB;