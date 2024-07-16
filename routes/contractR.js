const express = require('express');
const router = express.Router();
const ContractsController = require('../controllers/contractsC');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), ContractsController.getContractsList);

router.get('/edit:id', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), ContractsController.editContract);

router.get('/get/:id', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), ContractsController.getContract);

router.post('/save', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), ContractsController.saveContract);

router.get('/set/new', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), ContractsController.newContractsSet);

router.post('/sets', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), ContractsController.addContractSet);

router.get('/sets/get', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), ContractsController.getContractsSets);

router.get('/sets/edit/:id', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), ContractsController.editContractsSet);

router.post('/save/:id', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), ContractsController.saveContractSet);

router.get('/set/get/:id', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), ContractsController.getContractsSet);

router.delete('/set/delete/:id',authMiddleware.checkAuthenticated,authMiddleware.checkRole('Supreme Overlord'), ContractsController.deleteContractSet);

router.post('/add', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), ContractsController.addContracts);

router.delete('/delete/:id', authMiddleware.checkAuthenticated, authMiddleware.checkRole('Supreme Overlord'), ContractsController.deleteContracts);

module.exports = router;
