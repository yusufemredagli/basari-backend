const db = require('../config/db');

exports.createBook = async (req, res) => {
    try {
        const { subject_id, name, publisher, cover_image } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO Books (subject_id, name, publisher, cover_image) VALUES (?, ?, ?, ?)',
            [subject_id, name, publisher, cover_image]
        );
        
        res.status(201).json({ message: 'Kitap başarıyla eklendi', bookId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Kitap eklenirken hata oluştu: ' + error.message });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const [books] = await db.query(`
            SELECT Books.*, Subjects.name as subject_name 
            FROM Books 
            JOIN Subjects ON Books.subject_id = Subjects.id
        `);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Kitaplar getirilirken hata oluştu: ' + error.message });
    }
};