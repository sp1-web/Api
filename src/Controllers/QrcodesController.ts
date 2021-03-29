import {Express, Request, Response} from "express";
import {HttpResponse} from "../Utils/HttpResponse";
import {Qrcode} from "../Database/Models/Qrcode";
import {AuthMiddleware} from "../Middlewares/AuthMiddleware";
import {UserPromotion} from "../Database/Models/UserPromotion";

export class QrcodesController {

    constructor(app: Express) {
        app.post('/qrcodes/scan', AuthMiddleware.IsLogged, this.Scan);
    }

    /**
     * POST /qrcodes/scan
     * Récupère les promotions liées à un token QrCode
     */
    private Scan(req: Request, res: Response) {
        const body: any = req.body;
        const params = ['token'];
        if (!params.every(x => body.hasOwnProperty(x) && x !== null))
            return HttpResponse.error(res, 'Il manque des paramètres', 400);
        return Qrcode.findOne({
            where: { token: body.token },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: ['promotions']
        })
            .then(qrcode => {
                if (qrcode) {
                    if (qrcode.promotions.length > 0 ) {
                        let userPromotionsToCreate = [];
                        qrcode.promotions.map(x => {
                            if (!x.generic) {
                                userPromotionsToCreate.push({ user_id: res.locals.connected.id, promotion_id: x.id, used: false });
                            }
                        });
                        let promotion_ids = userPromotionsToCreate.map(x => x.promotion_id); // Liste des ids des promotions à ajouter
                        return UserPromotion.findAll({ where: { promotion_id: promotion_ids, user_id: res.locals.connected.id } })
                            .then(userPromotions => { // On récupère les promotions qui existent déjà dans la relation UserPromotion
                                let userPromotionsAlreadyCreated = userPromotions.map(x => x.promotion_id);
                                return UserPromotion.bulkCreate(userPromotionsToCreate.filter(x => !userPromotionsAlreadyCreated.includes(x.promotion_id)))
                                    .then(createdPromotions => {
                                        return HttpResponse.success(res, qrcode);
                                    });
                            });
                    }
                    return HttpResponse.success(res, qrcode);
                }
                return HttpResponse.error(res, 'Aucun QrCode trouvé', 404);
            })
    }

}
