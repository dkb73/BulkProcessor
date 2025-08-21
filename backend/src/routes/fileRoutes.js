const express = require('express');
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/multerMiddleware');

const router = express.Router();

// This route is protected. It first runs the auth middleware,
// then the multer middleware for a single file named 'csv',
// and finally, the controller logic.
router.post(
    '/upload',
    
    authMiddleware.protect,//verifies bearer token and adds decoded from user into req body. 

    uploadMiddleware.single('csv'), //multer middleware, 'csv' is the field name for the file in the form-data
    
    fileController.uploadFile//once file is uploaded, fileController pushes it into queue for processing and returns immediate success response.
);

module.exports = router;