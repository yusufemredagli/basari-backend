const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req,res,next) => {
    const authHeader = req.header('Authorization')

    if(!authHeader) {
        return res.status(401).json({ message: 'Erişim reddedildi. Token bulunamad.'})

    }

    const token = authHeader.split(' ')[1]

    if(!token){
        res.status(401).json({ message: 'Erişim reddedildi. Geçersiz token formatu'})
    }

    try{
        const verifed = jwt.verify(token,process.env.JWT_SECRET)
        req.user = verifed
        next()
    }catch(error){
        res.status(400).json({ message: 'Geçersiz Token'})
    }
}
