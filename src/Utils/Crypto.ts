import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export class Crypto {

    static PasswordHash(pwd: string): string {
        return crypto.createHash('sha256').update(pwd).digest('hex');
    }

    static GenerateToken(): string {
        return uuidv4();
    }
}