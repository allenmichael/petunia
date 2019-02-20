const crypto = require('crypto');

exports.encrypt = (hashlock, body) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', hashlock, iv);
    const encrypted = Buffer.concat([cipher.update(body, 'utf8'), cipher.final()]);
    delete iv;
    return encrypted.toString('base64');
}