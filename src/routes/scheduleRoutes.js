const express = require('express')
const router = express.Router()
const scheduleController = require('../controllers/scheduleController')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddlewares')

// 1. Yeni görev oluşturma
router.post('/' , authMiddleware , roleMiddleware('teacher' , 'admin')  , scheduleController.createSchedule)

// 2. Öğrencinin KENDİ ödevlerini çektiği kapı (DİKKAT: Bu her zaman :studentId'den ÖNCE yazılmalı)
router.get('/student/my-tasks' , authMiddleware , scheduleController.getStudentSchedules)

// 🔥 İŞTE EKSİK OLAN KAPI BURASI: Öğretmenin, seçtiği öğrencinin (ID) geçmişini çektiği kapı 🔥
router.get('/student/:studentId', authMiddleware, scheduleController.getStudentSchedulesById)

// 4. Görev durumu güncelleme (Tamamlandı/Bekliyor)
router.patch('/:scheduleId/status', authMiddleware, roleMiddleware('student', 'teacher', 'admin'), scheduleController.updateScheduleStatus)

// Bu satırı diğerlerinin altına ekle
router.delete('/:scheduleId', authMiddleware, scheduleController.deleteSchedule);
module.exports = router