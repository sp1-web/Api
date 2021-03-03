import {IHttpRequest} from "../Interfaces/IHttpRequest";
import {NextFunction, Response} from "express";
import {HttpResponse} from "../Utils/HttpResponse";

export class ExampleMiddleware {

    /**
     * Middleware example
     * @param req Request
     * @param res Response
     * @param next NextFunc
     */
    public static ProtectionAbcd(req: IHttpRequest, res: Response, next: NextFunction) {
        if (req.headers.authorization === "abcd") {
            return next(); // Succès, on passe la méthode
        }
        return HttpResponse.error(res, 'Impossible d\'accéder à la ressource');
    }

}