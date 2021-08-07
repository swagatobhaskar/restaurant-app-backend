const express = require('express')
const router = express.Router()
const Role = require('../../models/role');

// GET: /api/roles
// access: admin
router.get('/', (req, res) => {
    Role.find()
        .then(roles => res.json(roles))
        .catch(err => res.status(400));
});

// POST: /api/roles
// access: admin
router.post('/', (req, res) => {
    let role = new Role({
        role: req.body.role
    });

    role.save((err, role) => {
        if (err) throw err;
        res.json(role);
    })
    
});

module.exports = router;