import {IController} from "../Interfaces/IController";
import {Express, Response} from "express";
import {IHttpRequest} from "../Interfaces/IHttpRequest";
import {HttpResponse} from "../Utils/HttpResponse";
import {ExampleMiddleware} from "../Middlewares/ExampleMiddleware";

export class ExampleController implements IController {
    routePrefix: string;

    routes(app: Express) {
        app.get('/', this.Index);
        app.get('/protected/route', ExampleMiddleware.HelloWorld, this.ProtectedRoute);
    }

    /**
     * GET /
     * Default route example
     * @param req
     * @param res
     * @constructor
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
     * @constructor
     * @protected
     */
    protected ProtectedRoute(req: IHttpRequest, res: Response) {
        return HttpResponse.success(res, 'My protected route!');
    }
}