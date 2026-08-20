const db = require('../config/db');

// Kitaba Ait Test/Sayfa Aralığı Ekleme
exports.createBookTask = async (req, res) => {
    try {
        const { book_id, topic_id, task_name, start_page, end_page } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO Book_Tasks (book_id, topic_id, task_name, start_page, end_page) VALUES (?, ?, ?, ?, ?)',
            [book_id, topic_id, task_name, start_page, end_page]
        );
        
        res.status(201).json({ message: 'Kitap görevi/testi eklendi', bookTaskId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Kitap görevi eklenirken hata: ' + error.message });
    }
};