import JWT from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/config';

const ENCRYPTION_KEY = Buffer.from('12345678901234567890123456789012', 'utf-8');
const ENCRYPTION_IV = Buffer.from('1234567890123456', 'utf-8');

export const TokenClient = {
    generateToken: (data: any): string => {
        const token = JWT.sign(data, config.JWT_SECRET_KEY, { expiresIn: config.JWT_EXPIRE_IN, issuer: config.JWT_ISSUER});
        return TokenClient.encryptToken(token);
    },
    encryptToken: (token: string): string => {
        const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, ENCRYPTION_IV);
        let encrypted = cipher.update(token, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    },
    decryptToken: (encryptedToken: string): string => {
        const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, ENCRYPTION_IV);
        let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
};
