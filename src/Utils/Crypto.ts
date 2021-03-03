import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export class Crypto {

    static hashPassword(pwd: string): string {
        return crypto.createHash('sha256').update(pwd).digest('hex');
    }

    static generateToken(): string {
        return uuidv4();
    }
}