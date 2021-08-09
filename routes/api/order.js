const express = require('express')
const router = express.Router()

const Order = require('../../models/orders');

// GET: /api/order/history
// access: user
router.get('/history', (req, res) => {
    Order.find({user: req.user.userId})
        .then(orders => res.status(200).json(orders))
        .catch(err => console.log(err));
});

// GET: /api/order/:id
// access: user
router.get('/:id', (req, res) => {
    Order.findById(req.params.id)
        .then(order => res.status(200).json(order))
        .catch(err => console.log(err));
});


// POST: /api/order/
// access: user
router.post('/', (req, res) => {
    let order = new Order({
        menuItem: req.body.menuItem,
        totalPrice: req.body.totalPrice,
        quantity: req.body.quantity,
        user: req.user
    });
    order.save()
        .then(order => res.status(201).json(order))
        .catch(err => console.log(err));
});

// PATCH: /api/order/:id
// access: user
router.patch('/:id', (req, res) => {
    Order.findByIdAndUpdate(req.params.id, req.body)
        .then(resp => res.status(200).json(resp))
        .catch(err => console.log(err));
});

// DELETE: /api/order/:id
// access: user
router.delete('/:id', (req, res) => {
    Order.findByIdAndDelete(req.params.id)
        .then(res.sendStatus(200))
        .catch(err => console.log(err));
});


module.exports = router;