const { config } = require('dotenv');
const express = require('express')
const router = express.Router()

const User = require('../../models/users');
const utils = require('../../utils/jwtGen');

// PATH: /api/user/list
// access: admin
router.get('/list', (req, res) => {
    if (req.role !== 'admin'){
        res.status(401).json({'message': 'You\'re not authorized!'});
    } else {
        User.find()
            .then(users => res.json(users))
            .catch (err => res.status(400).send("No user found"));
    }
});

// PATH: /api/user/login
// access: public
router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) throw err;
        if (user) {
            console.log("USER:", user);
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (err) throw err;
                const payload = {
                    id: user._id,
                    role: user.role
                };
                console.log(payload);
                let accessToken = utils.generateAccessToken(payload);
                let refreshToken = utils.generateRefreshToken(payload);
                res.cookie('access', accessToken, {maxAge: 3600*1000, httpOnly: true, sameSite: 'lax'}) // secure: true
                res.cookie('refresh', refreshToken, {maxAge: 24*3600*1000, httpOnly: true, sameSite: 'lax'}) // secure: true, 
                res.status(200).json(user) //({user: user});
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
        password: req.body.password,
        role: req.body.role || "user"
    });

    newUser.save((err, createdUser) => {
        if (err) {
            console.log(err);
            res.status(400).json({'message': 'Some error occured!'});
        } else {
            const payload = {
                id: createdUser._id,
                role: createdUser.role
            };
            let accessToken = utils.generateAccessToken(payload);
            let refreshToken = utils.generateRefreshToken(payload);
            res.cookie('access', accessToken, {maxAge: 3600*1000, httpOnly: true, sameSite: 'lax'}); //  secure: true, 
            res.cookie('refresh', refreshToken, {maxAge: 24*3600*1000, httpOnly: true, sameSite: 'lax'});
            res.status(201).json(createdUser);
        }
    })
});

// GET: /api/user/:id
// access: user
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, resp) => {
        if (err){
            res.status(400).json({"message": "some error occured!"});
        } else {
            res.json(resp);
        }
    })
});

// PATCH: /api/user/:id
// access: user
router.patch('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, (err, resp) => {
        if (err){
            res.status(400).json({"message": "some error occured!"});
        } else {
            res.status(200).json(resp);
        }
    })
});

// DELETE: /api/user/:id
// access: admin
router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id, (err, resp) => {
        if (err){
            res.status(400).json({"message": "some error occured!"});
        } else {
            res.status(200).json({"message": "User deleted!"});
        }
    })
});

module.exports = router;