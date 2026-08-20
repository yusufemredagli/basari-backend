const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        // 1. Sınıf (grade) ve Şube (section) verilerini de req.body'den karşılıyoruz
        const { role, name, email, password, phone, grade, section } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. SQL sorgusuna grade ve section alanlarını da dahil ediyoruz
        const [result] = await db.query(
            'INSERT INTO Users (role, name, email, password_hash, phone, grade, section) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [role, name, email, hashedPassword, phone || null, grade || null, section || null]
        );
        
        res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu', userId: result.insertId });
        
    } catch (error) { // 3. HATA DÜZELTİLDİ: 'error' parametresi eklendi
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Bu email adresi zaten kullanılıyor.' });
        }
        res.status(500).json({ error: 'Kayıt hatası: ' + error.message });
    }
};
exports.login = async(req,res) => {
    try{

        const {email , password} = req.body
    
        const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
        }
    
        const user = users[0]
    
        const isMatch = await bcrypt.compare(password , user.password_hash)
    
        if(!isMatch){
            return res.status(401).json({message: 'hatalı sifre'})
    
        }
    
        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }//token 7 gun gecerli
        )
        res.json({
            message: 'giris basarili',
            token,
            user : {id: user.id, role: user.role, name: user.name}
        })
    }catch (error) {
        res.status(500).json({ error: 'Giriş hatası: ' + error.message });
    }
}
