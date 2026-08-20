const db = require('../config/db');

// Derse Ait Konu Ekleme
exports.createTopic = async (req, res) => {
    try {
        const { subject_id, name } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO Topics (subject_id, name) VALUES (?, ?)',
            [subject_id, name]
        );
        
        res.status(201).json({ message: 'Konu başarıyla eklendi', topicId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Konu eklenirken hata: ' + error.message });
    }
};

// Belirli bir dersin konularını listeleme
exports.getTopicsBySubject = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const [topics] = await db.query('SELECT * FROM Topics WHERE subject_id = ?', [subjectId]);
        res.json(topics);
    } catch (error) {
        res.status(500).json({ error: 'Konular getirilirken hata: ' + error.message });
    }
};