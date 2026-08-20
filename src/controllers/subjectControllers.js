const db = require('../config/db')

exports.getAllSubjects = async (req,res) => {
    try{
        const [subjects] = await db.query("SELECT * FROM Subjects")
        res.json(subjects)
    }catch(error){
        res.status(500).json({ error: 'Dersler getirilirken bir hata oluştu: ' + error.message})
    }
}

exports.createSubject = async (req,res) => {
    try{
        const {name,icon} = req.body
        const [result] = await db.query(
            'INSERT INTO Subjects (name, icon) VALUES (?, ?)',
            [name, icon]
        )
        res.status(501).json({ message: 'Ders başarıyla eklendi' , subjectId: result.insertId})
    }catch(error){
        res.status(500).json({ error: 'Ders eklerken hata oluştu : ' + error.message})
    }
}

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