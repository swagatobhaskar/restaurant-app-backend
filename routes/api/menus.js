const express = require('express');
const router = express.Router();

// Load menu model
const MenuItem = require('../../models/menuItems');

// @route GET api/menus
// @access Public
router.get('/', (req, res) => res.send('All food items here.'));

module.exports = router;