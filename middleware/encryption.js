const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const ALGORITHM = 'aes-256-gcm';


function encrypt(text) {
    if (!text) return text;
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
    cipher.setAAD(Buffer.from('event-manager', 'utf8'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    const combined = Buffer.concat([iv, authTag, Buffer.from(encrypted, 'hex')]);
    return combined.toString('base64');
}


function decrypt(encryptedData) {
    if (!encryptedData) return encryptedData;
    
    try {
        const combined = Buffer.from(encryptedData, 'base64');
        
        const iv = combined.slice(0, 16);
        const authTag = combined.slice(16, 32);
        const encrypted = combined.slice(32);
        
        const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
        decipher.setAAD(Buffer.from('event-manager', 'utf8'));
        decipher.setAuthTag(authTag);
        
        let decrypted = decipher.update(encrypted, null, 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        console.error('Ошибка расшифровки:', error);
        return null;
    }
}


const encryptSensitiveFields = (fields) => {
    return (req, res, next) => {
        if (req.body) {
            fields.forEach(field => {
                if (req.body[field]) {
                    req.body[field] = encrypt(req.body[field]);
                }
            });
        }
        next();
    };
};


const decryptSensitiveFields = (fields) => {
    return (req, res, next) => {
        if (req.body) {
            fields.forEach(field => {
                if (req.body[field]) {
                    req.body[field] = decrypt(req.body[field]);
                }
            });
        }
        next();
    };
};


function hashData(data, salt = null) {
    if (!data) return data;
    
    const actualSalt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHmac('sha256', actualSalt).update(data).digest('hex');
    return `${actualSalt}:${hash}`;
}


function verifyHash(data, hashedData) {
    if (!data || !hashedData) return false;
    
    const [salt, hash] = hashedData.split(':');
    if (!salt || !hash) return false;
    
    const computedHash = crypto.createHmac('sha256', salt).update(data).digest('hex');
    return computedHash === hash;
}

module.exports = {
    encrypt,
    decrypt,
    encryptSensitiveFields,
    decryptSensitiveFields,
    hashData,
    verifyHash
};
