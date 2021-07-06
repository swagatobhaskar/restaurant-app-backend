const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');

const User = require('../../models/users');

// PATH: /api/user/login
// access: public
router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) throw err;
        if (user) {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (err) throw err;
                let token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {expiresIn: '24h'});
                res.status(200).json({user: user, token: token});
            });
        } else {
            res.status(404).send("User not found!")
        }
    });
});

// PATH: /api/user/signup
// access: public
router.post('/signup', (req, res) => {
    const newUser = new User(req.body)
    newUser.save(req.body)
        .then(newUser => res.json(newUser))
        .catch(err => res.status(400).json({'error': 'please check entered data!'}));
});

module.exports = router;