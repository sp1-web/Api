import {Express, Request, Response} from "express";
import {Promotion} from "../Database/Models/Promotion";
import {HttpResponse} from "../Utils/HttpResponse";
import {AuthMiddleware} from "../Middlewares/AuthMiddleware";
import {Crypto} from "../Utils/Crypto";
import {Article} from "../Database/Models/Article";

export class PromotionsController {

    constructor(app: Express) {
        app.get('/promotions', AuthMiddleware.IsLogged, this.GetAll);
        app.get('/promotions/:id', AuthMiddleware.IsLogged, this.GetOne);
    }

    /**
     * GET /promotions
     * Récupère toutes les promotions existantes
     * @param req
     * @param res
     * @constructor
     * @private
     */
    private GetAll(req: Request, res: Response) {
        return Promotion.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } })
            .then(promotions => {
                return HttpResponse.success(res, promotions);
            })
    }

    /**
     * GET /promotions/{id}
     * Récupère une promotion par son id
     * @param req
     * @param res
     * @private
     */
    private GetOne(req: Request, res: Response) {
        const id = req.params.id;
        if (!Crypto.isUuid(id))
            return HttpResponse.error(res, "L'identifiant n'est pas valide", 400);
        return Promotion.findAll({
            where: { id },
            attributes: { exclude: ['createdAt', 'updatedAt', 'article_id'] },
            include: [
                { model: Article, attributes: { exclude: ['createdAt', 'updatedAt'] } }
            ]
        })
            .then(promotion => {
                if (promotion) {
                    return HttpResponse.success(res, promotion);
                }
                return HttpResponse.error(res, 'La promotion est introuvable', 404);
            })
    }
}
