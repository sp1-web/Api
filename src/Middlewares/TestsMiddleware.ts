import {NextFunction, Request, Response} from "express";
import {HttpResponse} from "../Utils/HttpResponse";
import {DecodeResult, ExpirationStatus} from "../Interfaces/JWT";
import {JWT} from "../Utils/JWT";

export class TestsMiddleware {

    public static IsLoggedTests(req: Request, res: Response, next: NextFunction) {
        const unauthorized = (message) => HttpResponse.error(res, message, 401);
        const tokenTest = req.headers["X-Tests-Token"];
        if (!tokenTest)
            return unauthorized(`You're not authorized to execute this`);
        if (process.env.SECRET_TEST === tokenTest) {
            return next();
        }
        return unauthorized(`You're not authorized to execute this`)
    }

}
