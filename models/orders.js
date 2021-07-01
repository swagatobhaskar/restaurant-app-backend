const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    menuItem: String,
    totalPrice: mongoose.Types.Decimal128,
    quantity: {
        type: Number,
        default: 1
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;