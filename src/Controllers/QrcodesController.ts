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
                        let userPromotions = [];
                        qrcode.promotions.map(x => {
                            if (!x.generic) {
                                userPromotions.push({ user_id: res.locals.connected.id, promotion_id: x.id, used: false });
                            }
                        })
                        return UserPromotion.bulkCreate(userPromotions)
                            .then(userPromotionsCreated => {
                                return HttpResponse.success(res, qrcode);
                            })
                    }
                    return HttpResponse.success(res, qrcode);
                }
                return HttpResponse.error(res, 'Aucun QrCode trouvé', 404);
            })
    }

}
