import {Express, Request, Response} from "express";
import {Promotion} from "../Database/Models/Promotion";
import {HttpResponse} from "../Utils/HttpResponse";
import {AuthMiddleware} from "../Middlewares/AuthMiddleware";
import {Crypto} from "../Utils/Crypto";
import {Article} from "../Database/Models/Article";
import {Qrcode} from "../Database/Models/Qrcode";
import {createReadStream} from "fs";

export class PromotionsController {

    constructor(app: Express) {
        app.get('/promotions/:id', AuthMiddleware.IsLogged, this.GetOne);
        app.get('/promotions', AuthMiddleware.IsLogged, AuthMiddleware.IsAdmin, this.GetAll);
        app.delete('/promotions/:id', AuthMiddleware.IsLogged, AuthMiddleware.IsAdmin, this.Delete);
        app.post('/promotions', AuthMiddleware.IsLogged, AuthMiddleware.IsAdmin, this.Create);
    }

    /**
     * GET /promotions
     * Récupère toutes les promotions existantes
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

    /**
     * POST /promotions
     * Ajoute une nouvelle promotion
     */
    private Create(req: Request, res: Response) {
        const body = req.body;
        const params = ['qrcode_id', 'article_id', 'name', 'code', 'percentageReduction', 'generic', 'expireAt'];
        if (!params.every(x => body.hasOwnProperty(x) && x !== null))
            return HttpResponse.error(res, `Paramètres nécessaires: ${params}`, 400);
        if (!Crypto.isUuid(body.qrcode_id) || !Crypto.isUuid(body.article_id))
            return HttpResponse.error(res, 'Les identifiants ne sont pas valides', 400);
        if (body.name.length <= 0)
            return HttpResponse.error(res, 'Le nom doit avoir au moins 1 caractère', 400);
        body.percentageReduction = parseFloat(body.percentageReduction);
        if (body.percentageReduction <= 0)
            return HttpResponse.error(res, "Le pourcentage de réduction doit être supérieur à 0", 400);
        if (typeof body.generic !== "boolean")
            return HttpResponse.error(res, "La variable 'generic' doit être de type booleen", 400);
        return Qrcode.findOne({ where: { id: body.qrcode_id } })
            // @ts-ignore
            .then(qrcode => {
                if (qrcode) {
                    return Article.findOne({ where: { id: body.article_id }})
                        // @ts-ignore
                        .then(article => {
                            if (article) {
                                return Promotion.create(body)
                                    .then(created => {
                                        if (created) {
                                            return HttpResponse.success(res, created, 'Promotion ajoutée', 201);
                                        }
                                        return HttpResponse.error(res);
                                    })
                            }
                            return HttpResponse.error(res, 'Article introuvable', 404);
                        })
                }
                return HttpResponse.error(res, 'Qrcode introuvable', 404);
            })
    }

    /**
     * DELETE /promotions/:id
     * Supprime une promotion
     */
    private Delete(req: Request, res: Response) {
        const id = req.params.id;
        if (!id || !Crypto.isUuid(id))
            return HttpResponse.error(res, 'L\'identifiant unique n\'est pas valide');
        return Promotion.destroy({ where: { id }, cascade: true })
            .then(deleted => {
                if (deleted)
                    return HttpResponse.success(res, null, 'Promotion supprimée', 200);
                return HttpResponse.error(res, 'Promotion introuvable', 404);
            })
    }
}
