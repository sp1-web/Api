import {Express, Request, Response} from "express";
import {UserPromotion} from "../Database/Models/UserPromotion";
import {Promotion} from "../Database/Models/Promotion";
import {HttpResponse} from "../Utils/HttpResponse";
import {AuthMiddleware} from "../Middlewares/AuthMiddleware";

export class ConnectedUserController {

    constructor(app: Express) {
        app.get('/me/promotions', AuthMiddleware.IsLogged, this.GetPromotions);
    }

    /**
     * GET /me/promotions
     * Récupère toutes les promotions de l'utilisateur connecté
     */
    private GetPromotions(req: Request, res: Response) {
        return UserPromotion.findAll({
            where: { user_id: res.locals.connected.id },
            attributes: { exclude: ['createdAt', 'updatedAt', 'user_id', 'promotion_id'] },
            include: [
                {
                    model: Promotion,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'qrcode_id'] }
                }
            ]
        })
            .then(userPromotions => {
                if (userPromotions) {
                    return HttpResponse.success(res, userPromotions);
                }
                return HttpResponse.error(res, 'Aucune promotion trouvée', 404);
            });
    }

}
