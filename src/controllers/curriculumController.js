const db = require('../config/db');

// --- 1. MÜFREDATI ÇEKME (Senin Kusursuz Fonksiyonun) ---
exports.getCurriculum = async (req, res) => {
    try {
        const [subjects] = await db.query('SELECT * FROM Subjects');
        const [topics] = await db.query('SELECT * FROM Topics');
        const [tasks] = await db.query(`
            SELECT 
                bt.id, 
                bt.topic_id, 
                bt.task_name, 
                bt.start_page, 
                bt.end_page, 
                b.name as book_name 
            FROM Book_Tasks bt 
            JOIN Books b ON bt.book_id = b.id
        `);

        const curriculum = subjects.map(subject => {
            return {
                id: subject.id,
                name: subject.name,
                topics: topics
                    .filter(t => t.subject_id === subject.id)
                    .map(topic => {
                        return {
                            id: topic.id,
                            name: topic.name,
                            tasks: tasks.filter(task => task.topic_id === topic.id)
                        };
                    })
            };
        });

        res.status(200).json(curriculum);
    } catch (error) {
        console.error("Müfredat çekilirken hata:", error);
        res.status(500).json({ error: 'Müfredat yüklenemedi: ' + error.message });
    }
};

// --- 2. YENİ DERS EKLEME ---
exports.addSubject = async (req, res) => {
    try {
        const { name } = req.body;
        await db.query('INSERT INTO Subjects (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'Ders başarıyla eklendi.' });
    } catch (error) {
        res.status(500).json({ error: 'Ders eklenirken hata: ' + error.message });
    }
};

// --- 3. YENİ KONU EKLEME ---
exports.addTopic = async (req, res) => {
    try {
        const { subject_id, name } = req.body;
        await db.query('INSERT INTO Topics (subject_id, name) VALUES (?, ?)', [subject_id, name]);
        res.status(201).json({ message: 'Konu başarıyla eklendi.' });
    } catch (error) {
        res.status(500).json({ error: 'Konu eklenirken hata: ' + error.message });
    }
};

// --- 4. YENİ KİTAP EKLEME ---
exports.addBook = async (req, res) => {
    try {
        const { subject_id, name, publisher } = req.body;
        // cover_image boşsa şimdilik null veya boş url atıyoruz
        await db.query(
            'INSERT INTO Books (subject_id, name, publisher, cover_image) VALUES (?, ?, ?, ?)', 
            [subject_id, name, publisher, 'url'] 
        );
        res.status(201).json({ message: 'Kitap başarıyla eklendi.' });
    } catch (error) {
        res.status(500).json({ error: 'Kitap eklenirken hata: ' + error.message });
    }
};

// --- 5. YENİ TEST / GÖREV EKLEME ---
exports.addTask = async (req, res) => {
    try {
        const { book_id, topic_id, task_name, start_page, end_page } = req.body;
        await db.query(
            'INSERT INTO Book_Tasks (book_id, topic_id, task_name, start_page, end_page) VALUES (?, ?, ?, ?, ?)', 
            [book_id, topic_id, task_name, start_page, end_page]
        );
        res.status(201).json({ message: 'Görev başarıyla eklendi.' });
    } catch (error) {
        res.status(500).json({ error: 'Görev eklenirken hata: ' + error.message });
    }
};

// --- BÜTÜN KİTAPLARI ÇEK (Admin Panelindeki Kitap Listesi İçin) ---
exports.getBooks = async (req, res) => {
    try {
        const [books] = await db.query('SELECT * FROM Books ORDER BY id DESC');
        res.status(200).json(books);
    } catch (error) {
        console.error("Kitaplar çekilirken hata:", error);
        res.status(500).json({ error: 'Kitaplar yüklenemedi: ' + error.message });
    }
};