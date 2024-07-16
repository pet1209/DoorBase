const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicC');
const authMiddleware = require('../middlewares/auth');
const multer = require('multer');


router.get('/',authMiddleware.publicPage, publicController.homepage);

router.get('/page/:page',authMiddleware.publicPage, publicController.page);

router.put('/submitcontactform',authMiddleware.publicPage, publicController.submitContactForm);



module.exports = router;
