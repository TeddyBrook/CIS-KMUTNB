const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); /* ใช้สำหรับโหลดตัวแปรจากไฟล์ .env เพื่อจัดการค่าคงที่ secret key */
dotenv.config();

/* กำหนดค่า secret key */
const secretKey = process.env.ACCESS_TOKEN_SECRET;

/* Middleware สำหรับการตรวจสอบ Token */
const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'No token provided' });

    /* ตรวจสอบความถูกต้องและถอดรหัส Token */
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        console.log('Decoded user:', user);
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;