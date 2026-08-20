const express = require('express');
const router = express.Router();
const curriculumController = require('../controllers/curriculumController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddlewares');

// Müfredatı çekme (Öğretmen, Öğrenci ve Admin görebilir)
router.get('/', authMiddleware, curriculumController.getCurriculum);

// Sadece ADMİN'in yapabileceği ekleme işlemleri:
router.post('/subjects', authMiddleware, roleMiddleware('admin'), curriculumController.addSubject);
router.post('/topics', authMiddleware, roleMiddleware('admin'), curriculumController.addTopic);
router.post('/books', authMiddleware, roleMiddleware('admin'), curriculumController.addBook);
router.post('/book-tasks', authMiddleware, roleMiddleware('admin'), curriculumController.addTask);

// Kitapları çekme rotası (Bunu eklemeyi unutmuştuk)
router.get('/books', authMiddleware, curriculumController.getBooks);

module.exports = router;