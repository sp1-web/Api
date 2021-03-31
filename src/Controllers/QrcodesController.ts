import {Express, Request, Response} from "express";
import {HttpResponse} from "../Utils/HttpResponse";
import {Qrcode} from "../Database/Models/Qrcode";
import {AuthMiddleware} from "../Middlewares/AuthMiddleware";
import {UserPromotion} from "../Database/Models/UserPromotion";
import {Crypto} from "../Utils/Crypto";

export class QrcodesController {

    constructor(app: Express) {
        app.post('/qrcodes/scan', AuthMiddleware.IsLogged, this.Scan);
        app.post('/qrcodes', AuthMiddleware.IsLogged, AuthMiddleware.IsAdmin, this.Create);
        app.get('/qrcodes', AuthMiddleware.IsLogged, AuthMiddleware.IsAdmin, this.GetAll);
        app.delete('/qrcodes/:id', AuthMiddleware.IsLogged, AuthMiddleware.IsAdmin, this.Delete);
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
            include: [
                {
                    association: 'promotions',
                    attributes: { exclude: ['createdAt', 'updatedAt', 'qrcode_id'] }
                }]
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
                        return UserPromotion.findAll({ where: { promotion_id: promotion_ids, user_id: res.locals.connected.id }, paranoid: false })
                            .then(userPromotions => { // On récupère les promotions qui existent déjà dans la relation UserPromotion
                                const userPromotionsAlreadyCreated = userPromotions.map(x => x.promotion_id);
                                const userPromotionsNeedToCreate = userPromotionsToCreate.filter(x => !userPromotionsAlreadyCreated.includes(x.promotion_id));
                                if (userPromotionsNeedToCreate.length === 0) {
                                    return HttpResponse.success(res, qrcode);
                                }
                                return UserPromotion.bulkCreate(userPromotionsNeedToCreate)
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

    /**
     * POST /qrcodes
     * Ajout d'un nouveau Qrcode
     */
    private Create(req: Request, res: Response) {
        const body = req.body;
        const params = ['name'];
        if (!params.every(x => body.hasOwnProperty(x) && x !== null))
            return HttpResponse.error(res, `Paramètres nécessaires: ${params}`, 400);
        body.token = Crypto.generateToken();
        return Qrcode.create(body)
            .then(created => {
                if (created)
                    return HttpResponse.success(res, created, 'Qrcode ajouté', 201);
                return HttpResponse.error(res);
            })
    }

    /**
     * GET /qrcodes
     * Récupère tous les qrcodes
     */
    private GetAll(req: Request, res: Response) {
        return Qrcode.findAll()
            .then(qrcodes => {
                return HttpResponse.success(res, qrcodes);
            })
    }

    /**
     * DELETE /qrcodes/:id
     * Supprime un qrcode et ses liaisons
     */
    private Delete(req: Request, res: Response) {
        const id = req.params.id;
        if (!id || !Crypto.isUuid(id))
            return HttpResponse.error(res, 'L\'identifiant n\'est pas valide', 400);
        return Qrcode.destroy({ where: { id }, cascade: true })
            .then(destroyed => {
                if (destroyed)
                    return HttpResponse.success(res, null, 'QrCode supprimé', 200);
                return HttpResponse.error(res, 'Qrcode introuvable', 404);
            })
    }
}
