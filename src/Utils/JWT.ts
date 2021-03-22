import { encode as encodeJwt, decode as decodeJwt, TAlgorithm } from 'jwt-simple';
import {DecodeResult, EncodeResult, ExpirationStatus} from "../Interfaces/JWT";

export class JWT {

    private static secretKey = process.env.JWT_SECRET;
    private static algo: TAlgorithm = "HS512";

    /**
     * Encode data and return JWT token
     * @param data
     */
    static encode(data): EncodeResult {
        const issued = Date.now();
        const expiresDiff = 15 * 60 * 1000;
        const expires = issued + expiresDiff;
        const payload = {
            ...data,
            issued,
            expires
        };
        return { token: encodeJwt(payload, this.secretKey, this.algo), issued, expires };
    }

    /**
     * Decode token and return his data
     * @param token
     */
    static decode(token): DecodeResult {
        let result = {};
        try {
            result = decodeJwt(token, this.secretKey, false, this.algo);
        } catch (_e) {
            const e: Error = _e;
            if (e.message === "No token supplied" || e.message === "Not enough or too many segments") {
                return { type: "invalid-token" };
            }
            if (e.message === "Signature verification failed" || e.message === "Algorithm not supported") {
                return { type: "integrity-error" };
            }
            if (e.message.indexOf('Unexpected token') === 0) {
                return { type: "invalid-token" };
            }
            throw e;
        }
        return { type: "valid", data: result };
    }

    static checkExpiration(token: any): ExpirationStatus {
        const now = Date.now();
        if (token.expires > now) return "active";
        const threeHours = 3 * 60 * 60 * 1000;
        const threeHoursAfterExpiration = token.expires + threeHours;
        if (threeHoursAfterExpiration > now) return "grace";
        return "expired";
    }


}
