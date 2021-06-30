const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 40
    },
    price: Number,
    category: {
        type: String,
        enum: ['Veg', 'Non-veg']
    },
    weight: Number,
    photo: { required: false },
    ingredients: [String]
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;