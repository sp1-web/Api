import {Express, Response} from "express";
import {IHttpRequest} from "../Interfaces/IHttpRequest";
import {HttpResponse} from "../Utils/HttpResponse";
import {ExampleMiddleware} from "../Middlewares/ExampleMiddleware";

export class ExampleController {

    constructor(app: Express) {
        app.get('/', this.Index);
        app.get('/protected/route', ExampleMiddleware.ProtectionAbcd, this.ProtectedRoute);
    }

    /**
     * GET /
     * Default route example
     * @param req
     * @param res
     * @protected
     */
    protected Index(req: IHttpRequest, res: Response) {
        return HttpResponse.success(res, 'API works!');
    }

    /**
     * GET /protected/route
     * Default protected (by middleware) route example
     * @param req
     * @param res
     * @protected
     */
    protected ProtectedRoute(req: IHttpRequest, res: Response) {
        return HttpResponse.success(res, 'My protected route!');
    }
}