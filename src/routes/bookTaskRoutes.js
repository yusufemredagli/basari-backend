const express = require('express');
const router = express.Router();
const bookTaskController = require('../controllers/bookTaskController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddlewares')

router.post('/', authMiddleware , roleMiddleware('teacher' , 'admin')  , bookTaskController.createBookTask);

module.exports = router;