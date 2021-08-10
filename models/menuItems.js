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
    photo: String,
    ingredients: [String],
    status: {
        type: String,
        required: true,
        enum: ['available', 'out-of-stock'],
        default: 'available'
    }
}, {
    timestamps: true
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;

/**
     photo: {
        data: Buffer,
        contentType: String,
        required: false
    },
 */