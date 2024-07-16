const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const userController = require('../controllers/userC');

// User routes
router.get('/register', (req, res) => res.render('user/register'));

router.post('/register', userController.register);

router.get('/login', (req, res) => res.render('user/login'));

router.post('/login', userController.login);

router.get('/logout', userController.logout);

router.get('/profile', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), userController.getProfile);

router.post('/profile', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), userController.updateProfile);

router.get('/users', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), userController.getUsers);

router.get('/users/edit/:id', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), userController.editUserForm); 

router.post('/users/update/:id', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), userController.updateUser); 

router.post('/users/delete/:id', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), userController.deleteUser); 

router.get('/login-history',authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), userController.getLoginHistory);

router.get('/site-activity',authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), userController.getSiteActivity);

router.get('/contact',authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), userController.viewContact);

router.delete('/deletecontact/:id',authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), userController.deletecontact);

module.exports = router;
