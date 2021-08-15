const express = require('express');
const router = express.Router();
const multer = require('multer');

const MenuItem = require('../../models/menuItems');

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb){
      cb(null, './files');
    },
    filename(req, file, cb){
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 2000000 // 2 MB = 2000000 bytes
  },
  fileFilter(req, file, cb){
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(
        new Error(
          'only upload files with jpg, jpeg, png format.'
        )
      );
    }
    cb(undefined, true); // continue with upload
  }
});

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
  
  if (req.role !== 'admin' || req.role !== 'staff') {
    res.status(401).send('You are not authorized to make changes!');
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
  
  if (req.role !== 'staff') {
    res.status(401).send('You are not authorized to make changes!');
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
  MenuItem.findById(req.params.id)
    .then(menuItem => res.json(menuItem))
    .catch(err => res.status(400).json({'message': 'Something went wrong!'}));
});

module.exports = router;



// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'images/menuItem')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
//   }
// });


// // Set this to a function to control which files should be uploaded and which should be skipped
// const fileFilter = (req, file, cb) => {
// // The function should call `cb` with a boolean
// // to indicate if the file should be accepted

// const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
// if(allowedFileTypes.includes(file.mimetype)) {
//   // To accept the file pass `true`, like so:
//   cb(null, true);
// } else {
//   // To reject this file pass `false`, like so:
//   cb(null, false);
// }
// }

// const upload = multer({ storage, fileFilter })
