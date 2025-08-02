const express = require('express');
const router = express.Router();
const clothesController = require('../controllers/clothes');

router.get('/', clothesController.getMultiClothes);
router.get('/:id', clothesController.getOneClothes);
router.post('/', clothesController.addClothes);
router.put('/:id', clothesController.updateClothesById);
router.delete('/:id', clothesController.deleteClothes);

module.exports = router; 