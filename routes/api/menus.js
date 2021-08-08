const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/menuItem')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
    }
  });


// Set this to a function to control which files should be uploaded and which should be skipped
const fileFilter = (req, file, cb) => {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if(allowedFileTypes.includes(file.mimetype)) {
    // To accept the file pass `true`, like so:
    cb(null, true);
  } else {
    // To reject this file pass `false`, like so:
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
// @access admin/staff
router.post('/', upload.single('photo'),(req, res, next) => {
    const photo = req.file && req.file.filename;
    const name = req.body.name;
    const price = req.body.price;
    const category = req.body.category;
    const weight = req.body.weight;
    const ingredients = req.body.ingredients
    
    const newMenuItemData = {name, price, category, weight, ingredients, photo}
    const newMenuItem = new MenuItem(newMenuItemData);
    newMenuItem.save()
        .then(menuItem => res.json(menuItem))
        .catch(err => res.status(400).json('Error: ' + err));
});

// @route PATCH api/menu/id
// @access admin/staff
router.patch('/:id', (req, res, next) => {
  MenuItem.findByIdAndUpdate(req.params.id, req.body)
    .then(menuItem => res.json(menuItem))
    .catch(err => res.status(400).json({'message': 'Something went wrong!'}));
});

// @route DELETE api/menu/id
// @access admin/staff
router.delete('/:id', (req, res, next) => {
  MenuItem.findByIdAndDelete(req.params.id)
    .then(menuItem => res.json({'message': 'Menu item deleted successfully!'}))
    .catch(err => res.status(400).json({'message': 'No menu item found with this id!'}));
});

// @route GET api/menu/id
// @access public
router.get('/:id', (req, res) => {
  MenuItem.findById(req.params.id)
    .then(menuItem => res.json(menuItem))
    .catch(err => res.status(400).json({'message': 'Something went wrong!'}));
});

module.exports = router;

/*
app.route('/book')
  .get(function (req, res) {
    res.send('Get a random book')
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  })
*/