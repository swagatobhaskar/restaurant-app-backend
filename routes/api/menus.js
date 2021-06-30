const express = require('express');
const router = express.Router();
const fs = require('fs');
const  path = require('path');
const multer = require('multer');
const  bodyParser = require('body-parser');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/menuItem')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
    }
  });

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
  
const upload = multer({ storage, fileFilter })

// Load menu model
const MenuItem = require('../../models/menuItems');

// @route GET api/menus
// @access Public
router.get('/', (req, res) => {
    MenuItem.find()
        .then(items => res.json(items))
        .catch(err =>  res.status(400).json({'message': 'No items found!'}));
});

// @route POST api/menus
// @access Public
router.post('/', upload.single('photo'),(req, res) => {
    const photo = req.file.filename;
    const name = req.body.name;
    const price = req.body.price;
    const category = req.body.category;
    const weight = req.body.weight;
    const ingredients = req.body.ingredients
    
    const newMenuItemData = {name, price, category, weight, ingredients, photo}
    const newMenuItem = new MenuItem(newMenuItemData);
    newMenuItem.save()
        .then(menuItem => res.json({'message': 'Item added!'}))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;