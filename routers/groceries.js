const express = require('express');
const router = express.Router();
const groceryController = require('../controllers/groceries');

router.get('/', groceryController.getMultiGroceries);
router.get('/:id', groceryController.getOneGrocery);
router.post('/', groceryController.addGrocery);
router.put('/:id', groceryController.updateGroceryById);
router.delete('/:id', groceryController.deleteGrocery);

module.exports = router;