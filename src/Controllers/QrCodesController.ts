import {Express, Request, Response} from "express";
import {HttpResponse} from "../Utils/HttpResponse";
import {QrCode} from "../Database/Models/QrCode";
import {AuthMiddleware} from "../Middlewares/AuthMiddleware";

export class QrCodesController {

    constructor(app: Express) {
        app.post('/qrcodes/scan', AuthMiddleware.IsLogged, this.Scan);
    }

    private Scan(req: Request, res: Response) {
        const body: any = req.body;
        const params = ['token'];
        if (!params.every(x => body.hasOwnProperty(x) && x !== null))
            return HttpResponse.error(res, 'Il manque des paramètres', 400);
        return QrCode.findOne({
            where: { token: body.token },
            attributes: { exclude: ['createdAt', 'updatedAT'] },
            include: ['promotions']
        })
            .then(qrcode => {
                if (qrcode) {
                    return HttpResponse.success(res, qrcode);
                }
                return HttpResponse.error(res, 'Aucun QrCode trouvé', 404);
            })
    }

}
