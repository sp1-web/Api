import {Express, Request, Response} from "express";
import {UserPromotion} from "../Database/Models/UserPromotion";
import {Promotion} from "../Database/Models/Promotion";
import {HttpResponse} from "../Utils/HttpResponse";
import {AuthMiddleware} from "../Middlewares/AuthMiddleware";
import {Crypto} from "../Utils/Crypto";

export class ConnectedUserController {

    constructor(app: Express) {
        app.get('/me/promotions', AuthMiddleware.IsLogged, this.GetPromotions);
        app.delete('/me/promotions/:id', AuthMiddleware.IsLogged, this.DeletePromotion);
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

    /**
     * DELETE /me/promotions/:id
     * Supprime une promotion liée à l'utilisateur connecté
     */
    private DeletePromotion(req: Request, res: Response) {
        const id = req.params.id;
        if (!Crypto.isUuid(id)) {
            return HttpResponse.error(res, "L'identifiant n'est pas valide", 400);
        }
        return UserPromotion.destroy({ where: { id: req.params.id, user_id: res.locals.connected.id, deletedAt: null } })
            .then(userPromotion => {
                if (userPromotion) {
                    return HttpResponse.success(res, null, 'Votre promotion a été retirée' ,200)
                }
                return HttpResponse.error(res, "Vous ne pouvez pas supprimer cette promotion", 403);
            })
    }

}
