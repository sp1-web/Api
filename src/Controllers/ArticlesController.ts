import {Express, Request, Response} from "express";
import {Article} from "../Database/Models/Article";
import {HttpResponse} from "../Utils/HttpResponse";
import {AuthMiddleware} from "../Middlewares/AuthMiddleware";
import {Crypto} from "../Utils/Crypto";

export class ArticlesController {

    constructor(app: Express) {
        app.get('/articles', AuthMiddleware.IsLogged, AuthMiddleware.IsAdmin, this.GetAll);
        app.post('/articles', AuthMiddleware.IsLogged, AuthMiddleware.IsAdmin, this.Create);
        app.delete('/articles/:id', AuthMiddleware.IsLogged, AuthMiddleware.IsAdmin, this.Delete);
    }

    private GetAll(req: Request, res: Response) {
        return Article.findAll()
            .then(articles => {
                return HttpResponse.success(res, articles, null, 200);
            })
    }

    private Create(req: Request, res: Response) {
        const body = req.body;
        const params = ['name', 'description', 'img', 'price'];
        if (!params.every(x => body.hasOwnProperty(x) && x !== null))
            return HttpResponse.error(res, `Paramètres nécessaires: ${params}`, 400);
        if (body.name.length <= 0)
            return HttpResponse.error(res, 'Vous devez renseigner un nom d\'article', 400);
        body.price = parseFloat(body.price);
        if (body.price <= 0.00)
            return HttpResponse.error(res, 'Le prix ne peut pas être inférieur ou égal à 0', 400);
        return Article.create(body)
            .then(created => {
                if (created) {
                    return HttpResponse.success(res, created, "Article ajouté", 201);
                }
                return HttpResponse.error(res);
            });
    }

    private Delete(req: Request, res: Response) {
        const id = req.params.id;
        if (!id || !Crypto.isUuid(id))
            return HttpResponse.error(res, 'L\'identifiant de l\'article n\'est pas valide', 400);
        return Article.destroy({ where: { id } })
            .then(deleted => {
                if (deleted)
                    return HttpResponse.success(res, null, 'Article supprimé avec succès', 200);
                return HttpResponse.error(res, 'Article introuvable', 404);
            })
    }
}
