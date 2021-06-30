const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 40,
        unique: true
    },
    price: Number,
    category: {
        type: String,
        enum: ['veg', 'non-veg']
    },
    weight: Number,
    photo: {
        type: String,
        required: false
    },
    ingredients: [String]
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;