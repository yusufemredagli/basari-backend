const express = require('express')
const router = express.Router()
const topicController = require('../controllers/topicController')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddlewares')

router.post('/', authMiddleware, authMiddleware, roleMiddleware('teacher' , 'admin') , topicController.createTopic)

router.get('/subject/:subjectId',  topicController.getTopicsBySubject)

module.exports = router;