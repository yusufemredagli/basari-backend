const express = require('express')
const router = express.Router()
const subjectController = require('../controllers/subjectControllers')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddlewares')

router.get('/', authMiddleware, subjectController.getAllSubjects)

router.post('/', authMiddleware , roleMiddleware('teacher' , 'admin') , subjectController.createSubject)

module.exports = router