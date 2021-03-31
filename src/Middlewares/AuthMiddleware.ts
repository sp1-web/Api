import {NextFunction, Request, Response} from "express";
import {HttpResponse} from "../Utils/HttpResponse";
import {JWT} from "../Utils/JWT";
import {DecodeResult, ExpirationStatus} from "../Interfaces/JWT";

export class AuthMiddleware {

    public static REQUEST_HEADER_JWT = 'x-jwt';
    private static RESPONSE_HEADER_JWT_RENEWAL = 'X-JWT-Renewal';

    public static IsLogged(req: Request, res: Response, next: NextFunction) {
        const unauthorized = (message) => HttpResponse.error(res, message, 401);
        const header = req.headers[AuthMiddleware.REQUEST_HEADER_JWT];
        if (!header)
            return unauthorized(`Invalid token authorization`);
        const decoded: DecodeResult = JWT.decode(header);
        if (decoded.type === 'integrity-error' || decoded.type === 'invalid-token')
            return unauthorized(`Failed to decode or validate authorization token. Reason: ${decoded.type}`);
        const expiration: ExpirationStatus = JWT.checkExpiration(decoded.data);
        if (expiration === 'expired')
            return unauthorized(`Authorization token has expired`);
        let data: any = decoded.data;
        if (expiration === 'grace') {
            const { token, expires, issued } = JWT.encode(decoded.data);
            data = {
                ...decoded.data,
                expires,
                issued
            }
            res.setHeader(AuthMiddleware.RESPONSE_HEADER_JWT_RENEWAL, token);
        }
        res.locals = {
            ...res.locals,
            connected: data
        }
        return next();
    }

    public static IsAdmin(req: Request, res: Response, next: NextFunction) {
        if (res.locals.connected.isAdmin)
            return next();
        return HttpResponse.error(res, "Vous n'avez pas le droit d'effectuer cette action", 403);
    }

}
