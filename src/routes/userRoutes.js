const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddlewares');

router.get('/', authMiddleware, roleMiddleware('admin'), userController.getAllUsers);

router.get('/students', authMiddleware, roleMiddleware('admin', 'teacher'), userController.getStudents);

router.put('/:id' , authMiddleware , roleMiddleware('admin') , userController.updateUser)

router.delete('/:id', authMiddleware, roleMiddleware('admin'), userController.deleteUser);

module.exports = router;