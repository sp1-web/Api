import {Express, Request, Response} from "express";
import {Promotion} from "../Database/Models/Promotion";
import {HttpResponse} from "../Utils/HttpResponse";
import {AuthMiddleware} from "../Middlewares/AuthMiddleware";

export class PromotionsController {

    constructor(app: Express) {
        app.get('/promotions', AuthMiddleware.IsLogged, this.GetAll);
    }

    private GetAll(req: Request, res: Response) {
        return Promotion.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } })
            .then(promotions => {
                return HttpResponse.success(res, promotions);
            })
    }

}
