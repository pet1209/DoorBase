const express = require('express');
const router = express.Router();


const userRoutes = require('./userR');
const contractRoutes = require('./contractR'); 
const publicRoutes = require('./publicR'); 

router.use('/', publicRoutes);

router.use('/', userRoutes);



router.use('/control/contract', contractRoutes); 

module.exports = router;




