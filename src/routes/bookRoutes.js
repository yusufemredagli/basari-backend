const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddlewares')

router.get('/', authMiddleware, bookController.getAllBooks);

router.post('/', authMiddleware , roleMiddleware('teacher' , 'admin') ,  bookController.createBook);

module.exports = router;