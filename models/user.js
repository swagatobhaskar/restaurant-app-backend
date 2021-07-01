const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        fname: { type: String, required: true},
        lname: { type: String, required: true},
    },
    phone: { type: String, required: true},
    email: { type: String, required: true},
    address: {
        zip: { type: String, required: true},
        street: { type: String, required: true},
        block: { type: String},
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 32
    },
    joined_on: {
        type: Date,
        default: Date.now()
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;