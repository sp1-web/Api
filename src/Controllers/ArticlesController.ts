import {Express, Request, Response} from "express";
import {Article} from "../Database/Models/Article";
import {HttpResponse} from "../Utils/HttpResponse";
import {AuthMiddleware} from "../Middlewares/AuthMiddleware";

export class ArticlesController {

    constructor(app: Express) {
        app.get('/articles', AuthMiddleware.IsLogged, AuthMiddleware.IsAdmin, this.GetAll);
    }

    private GetAll(req: Request, res: Response) {
        return Article.findAll()
            .then(articles => {
                return HttpResponse.success(res, articles, null, 200);
            })
    }


}
