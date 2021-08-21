const express = require('express');
const router = express.Router();
const multer = require('multer');

const MenuItem = require('../../models/menuItems');

const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');

const URI = process.env.mongoURI;

const authorisedRoles = ['admin', 'staff'];

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const con = mongoose.createConnection(URI, options);

// Init gfs
let gfs;

con.once("open", () => {
    // Init stream
    gfs = Grid(con.db, mongoose.mongo);
    gfs.collection('uploads');
});

// create storage engine
const storage = new GridFsStorage({
    url: URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });

// @route GET api/menus
// @access Public
router.get('/', (req, res) => {
    MenuItem.find()
        .then(items => res.json({items, file: res.file}))
        .catch(err =>  res.status(400).json({'message': 'No items found!'}));
});

// @route POST api/menus
// @access admin/staff
router.post('/', upload.single('photo'), (req, res) => {

  if (!req.role in authorisedRoles) {
    res.status(401).send('You are not authorized to add menu items!');
  }
  
  if (!req.file) {
    res.status(400).send("Menu item photo is required");
  }

  const name = req.body.name;
  const price = req.body.price;
  const category = req.body.category;
  const weight = req.body.weight;
  const ingredients = req.body.ingredients;
  const photo = req.file.filename;

  const newMenuData = {
    name, price, category, weight, ingredients, photo
  }

  const newMenu = new MenuItem(newMenuData)

  newMenu.save()
    .then(menuItem => res.json(menuItem))
    .catch(err => res.status(400).json('Error: ' + err));
});

// @route PATCH api/menu/id
// @access admin/staff
router.patch('/:id', upload.single('photo'), (req, res, next) => {
  
  if (!req.role in authorisedRoles) {
    res.status(401).send('You are not authorized to make changes!');
  }

  if (req.file) {
    //remove old photo and save new photo
  }

  MenuItem.findByIdAndUpdate(req.params.id, req.body)
    .then(menuItem => res.json(menuItem))
    .catch(err => res.status(400).json({'message': 'Something went wrong!'}));
});

// @route DELETE api/menu/id
// @access admin/staff
router.delete('/:id', (req, res, next) => {
  MenuItem.findByIdAndDelete(req.params.id)
    .then(item => res.json({'message': 'Menu item deleted successfully!'}))
    .catch(err => res.status(400).json({'message': 'No menu item found with this id!'}));
});

// @route GET api/menu/id
// @access public
router.get('/:id', (req, res) => {
  // get the image through gfs
  const query = MenuItem.findById(req.params.id)
  const file = gfs.files.find({filename: query.photo})
    .toArray(function (err, files) {
      if (err) throw err;
      return files;
    })
  const resp = {
       "name": query.name, "price": query.price, "weight": query.weight, "ingredients": query.ingredients,
       "category": query.ingredients, "photo": file
   };
  return res.status(200).send({resp});
    //.then(menuItem => res.json(menuItem))
    //.catch(err => res.status(400).json({'message': 'Something went wrong!'}));
});

module.exports = router;
