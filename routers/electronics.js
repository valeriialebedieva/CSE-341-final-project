const express = require('express');
const router = express.Router();
const electronicsController = require('../controllers/electronics');

router.get('/', electronicsController.getMultiElectronics);
router.get('/:id', electronicsController.getOneElectronics);
router.post('/', electronicsController.addElectronics);
router.put('/:id', electronicsController.updateElectronicsById);
router.delete('/:id', electronicsController.deleteElectronics);

module.exports = router; 