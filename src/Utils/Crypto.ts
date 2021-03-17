import * as crypto from 'crypto';
import { v4 as uuidv4, validate } from 'uuid';

export class Crypto {

    static hashPassword(pwd: string): string {
        const salted = `${process.env.PASSWORD_SALT}${pwd}`;
        return crypto.createHash('sha256').update(salted).digest('hex');
    }

    static generateToken(): string {
        return uuidv4();
    }

    static isUuid(uuid: string) {
        return validate(uuid);
    }
}
