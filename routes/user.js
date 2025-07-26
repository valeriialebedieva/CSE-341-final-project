const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/', userController.getMultiUsers);
router.get('/:id', userController.getOneUser);
router.post('/', userController.addUser);
router.put('/:id', userController.updateUserbyId);
router.delete('/:id', userController.deleteUser);

module.exports = router;