const { config } = require('dotenv');
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');

const User = require('../../models/users');

// PATH: /api/user/list
// access: admin
router.get('/list', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).send("No user found"));
});

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
    let newUser = new User({
        email: req.body.email,
        password: req.body.password
    });

    newUser.save((err, createdUser) => {
        if (err) {
            //console.log(err);
            res.status(400).json({'message': 'Some error occured!'});
        } else {
            let payload = { id: createdUser._id};
            const token = jwt.sign(payload, process.env.SECRET_KEY);
            res.status(201).send({ token })
        }
    })
});

// PATH: /api/user/profile
// access: private
router.get('/:id', (req, res) => {
    // using arrow function callback
    User.findById(req.params.id, (err, resp) => {
        if (err){
            res.status(400).json({"message": "some error occured!"});
        } else {
            res.json(resp);
        }
    })
});

module.exports = router;