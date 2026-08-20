const db = require('../config/db');

// 1. Sadece Öğrencileri Çek (Öğretmen Dashboard'u İçin)
exports.getStudents = async (req, res) => {
    try {
        // Sadece öğrencileri seçiyoruz. Sınıf ve Şube (grade, section) otomatik gelecek.
        const [students] = await db.query(
            "SELECT id, name, email, role, phone, grade, section FROM Users WHERE role = 'student' ORDER BY grade ASC, name ASC"
        );
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: 'Öğrenciler getirilemedi.' });
    }
};
// 2. Bütün Kullanıcıları Çek (Admin Dashboard'u İçin)
exports.getAllUsers = async (req, res) => {
    try {
        // Admin panelinde listelemek için herkesi (öğretmen ve öğrencileri) çekiyoruz
        // Şifreleri (password_hash) GÖNDERMİYORUZ (Güvenlik!)
        const [users] = await db.query(
            "SELECT id, name, email, role, phone FROM Users ORDER BY id DESC"
        );
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Kullanıcı listesi yüklenemedi: ' + error.message });
    }
};

// 3. Kullanıcı Silme (Admin Dashboard'u İçin)
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id; // URL'den gelen ID

        // Önce kullanıcının var olup olmadığına ve silinip silinmediğine bakıyoruz
        const [result] = await db.query(
            "DELETE FROM Users WHERE id = ?", 
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Silinecek kullanıcı bulunamadı.' });
        }

        res.status(200).json({ message: 'Kullanıcı sistemden başarıyla silindi.' });
    } catch (error) {
        // Eğer bu kullanıcının sistemde aktif ödevleri (foreign key) varsa SQL hata verir.
        // O yüzden hata yakalamayı detaylandırıyoruz.
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(400).json({ error: 'Bu kullanıcıya atanmış görevler var. Önce görevleri silmelisiniz.' });
        }
        res.status(500).json({ error: 'Kullanıcı silinirken hata oluştu: ' + error.message });
    }
};


exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role, phone, grade, section } = req.body;

    try {
        // 1. Temel SQL Sorgumuzu hazırlıyoruz
        let query = `UPDATE users SET name = ?, email = ?, role = ?, phone = ?, grade = ?, section = ?`;
        let queryParams = [name, email, role, phone, grade, section];

        // 2. Akıllı Şifre Kontrolü: 
        // Eğer admin yeni bir şifre yazdıysa onu hash'leyip güncelleyeceğiz.
        // Eğer şifre kutusu boş gönderildiyse, eski şifre aynen kalacak, dokunmayacağız!
        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += `, password = ?`;
            queryParams.push(hashedPassword);
        }

        query += ` WHERE id = ?`;
        queryParams.push(id);

        // 3. Sorguyu veritabanına gönder
        const [result] = await db.query(query, queryParams);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Güncellenecek kullanıcı bulunamadı!" });
        }

        res.status(200).json({ message: "Kullanıcı başarıyla güncellendi!" });

    } catch (error) {
        console.error("Kullanıcı güncelleme hatası:", error);
        res.status(500).json({ error: "Sunucu hatası oluştu, backend loglarını kontrol edin." });
    }
};