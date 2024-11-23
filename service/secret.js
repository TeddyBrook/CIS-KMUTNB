const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex'); /* สร้าง secret key แบบสุ่ม */
console.log('Generated Secret Key:', secret);