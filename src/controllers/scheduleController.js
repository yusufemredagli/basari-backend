const db = require('../config/db')

exports.createSchedule = async (req, res) => {
    try {
        const { student_id, subject_id, topic_id, book_task_id, assigned_date } = req.body;
        const teacher_id = req.user.id; // Token'dan giriş yapan hocanın ID'si

        const [result] = await db.query(
            `INSERT INTO Schedules (student_id, teacher_id, subject_id, topic_id, book_task_id, assigned_date, status) 
             VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
            [student_id, teacher_id, subject_id || null, topic_id || null, book_task_id || null, assigned_date]
        );

        res.status(201).json({ 
            message: 'Görev başarıyla atandı ve takvime işlendi.', 
            scheduleId: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: 'Görev atanırken hata oluştu: ' + error.message });
    }
};

exports.getStudentSchedules = async (req, res) => {
    try {
        // ID'yi URL'den değil, AuthMiddleware'in token'dan çözüp eklediği yerden alıyoruz!
        const student_id = req.user.id; // veya req.userId (senin middleware'ine göre)

        const [schedules] = await db.query(`
            SELECT 
                Schedules.id, 
                Schedules.assigned_date, 
                Schedules.status,
                COALESCE(Topics.name, 'Genel') as topic_name,
                COALESCE(Subjects.name, 'Genel Ders') as subject_name,
                COALESCE(Books.name, 'Kitap Yok') as book_name,
                COALESCE(Book_Tasks.task_name, 'Özel Görev') as task_name,
                Book_Tasks.start_page,
                Book_Tasks.end_page
            FROM Schedules
            LEFT JOIN Subjects ON Schedules.subject_id = Subjects.id
            LEFT JOIN Topics ON Schedules.topic_id = Topics.id
            LEFT JOIN Book_Tasks ON Schedules.book_task_id = Book_Tasks.id
            LEFT JOIN Books ON Book_Tasks.book_id = Books.id
            WHERE Schedules.student_id = ?
        `, [student_id]);

        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ error: 'Ödevler yüklenemedi: ' + error.message });
    }
};

exports.updateScheduleStatus = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const { status } = req.body; // 'completed' veya 'pending'

        await db.query(
            'UPDATE Schedules SET status = ? WHERE id = ?',
            [status, scheduleId]
        );

        res.json({ message: 'Görev durumu güncellendi.' });
    } catch (error) {
        res.status(500).json({ error: 'Durum güncellenirken hata oluştu: ' + error.message });
    }
};

exports.getStudentSchedulesById = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const [schedules] = await db.query(`
            SELECT 
                Schedules.id, Schedules.assigned_date, Schedules.status,
                COALESCE(Topics.name, 'Genel') as topic_name,
                COALESCE(Subjects.name, 'Genel Ders') as subject_name,
                COALESCE(Books.name, 'Kitap Yok') as book_name,
                COALESCE(Book_Tasks.task_name, 'Özel Görev') as task_name,
                Book_Tasks.start_page, Book_Tasks.end_page
            FROM Schedules
            LEFT JOIN Subjects ON Schedules.subject_id = Subjects.id
            LEFT JOIN Topics ON Schedules.topic_id = Topics.id
            LEFT JOIN Book_Tasks ON Schedules.book_task_id = Book_Tasks.id
            LEFT JOIN Books ON Book_Tasks.book_id = Books.id
            WHERE Schedules.student_id = ?
            ORDER BY Schedules.assigned_date DESC
        `, [studentId]);
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteSchedule = async (req, res) => {
    try {
        const scheduleId = req.params.scheduleId;
        // İstersen sadece o öğretmenin silmesi için req.user.id kontrolü de ekleyebilirsin
        const [result] = await db.query('DELETE FROM Schedules WHERE id = ?', [scheduleId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Silinecek görev bulunamadı.' });
        }
        res.status(200).json({ message: 'Görev başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ error: 'Görev silinirken hata: ' + error.message });
    }
};