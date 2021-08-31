const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const MenuItem = require('../../models/menuItems');

const URI = process.env.mongoURI;

const authorisedRoles = ['admin', 'staff'];

const conn = mongoose.createConnection(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Init gfs
let gfs;
Grid.mongo = mongoose.mongo;
conn.once('open', () => {
    gfs = Grid(conn.db);
    gfs.collection('uploads');
    // replace with the following in future
    // gfs = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'uploads',});
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
    .then(items => res.status(200).json(items))
    .catch(err =>  res.status(400).json({'message': 'No items found!'}));
});

// @route GET api/menus/image/:filename
// @access Public
router.get('/image/:filename', (req, res) => {
  
  gfs.files.findOne({filename: req.params.filename}, function(err, file) {
    if (err) throw err;
    let readStream = gfs.createReadStream({filename: file.filename});
    /*
    let data = '';
    readStream.on('data', (chunk) => {
      data += chunk.toString('base64');
    })
    readStream.on("error", function (err) {
      res.send("Image not found");
    });
    */
    readStream.pipe(res);
  })
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
  const photo = `http://127.0.0.1:3001/api/menus/images/${req.file.filename}`;

  const newMenuData = {
    name, price, category, weight, ingredients, photo
  }

  const newMenu = new MenuItem(newMenuData)

  newMenu.save()
    .then(menuItem => res.json(menuItem))
    .catch(err => res.status(400).json('Error: ' + err));
});

// @route PATCH api/menu/:id
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

// @route DELETE api/menu/:id
// @access admin/staff
router.delete('/:id', (req, res, next) => {
  MenuItem.findByIdAndDelete(req.params.id)
    .then(item => res.json({'message': 'Menu item deleted successfully!'}))
    .catch(err => res.status(400).json({'message': 'No menu item found with this id!'}));
});

// @route GET api/menu/:id
// @access public
router.get('/:id', (req, res) => {
  MenuItem.findById(req.params.id)
    .then(menu => res.status(200).json(menu))
    .catch(err => res.status(400).send(err));  
});

// @route api/menus/images/all
// @access public
router.get('/images/all', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if ( !files || files.length === 0 ) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }
    // Files exist
    return res.json(files);
  });
})

module.exports = router;
