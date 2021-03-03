import {Express, Request, Response} from "express";
import {HttpResponse} from "../Utils/HttpResponse";
import {User} from "../Database/Models/User";
import {Crypto} from "../Utils/Crypto";

export class AuthController {

    constructor(app: Express) {
        app.post('/login', this.login);
    }

    /**
     * POST /login
     * Attempt to login with email/password
     * @param req
     * @param res
     * @private
     */
    private login(req: Request, res: Response) {
        const body = req.body;
        if (!body.hasOwnProperty('email') && !body.hasOwnProperty('password')) {
            return HttpResponse.error(res, 'Adresse e-mail ou mot de passe invalide', 404);
        }
        const passwordHash = "";
        return User.findOne({
            where: { email: body.email, password: passwordHash },
            attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
        })
            .then(user => {
                if (user !== null) {
                    user.token = Crypto.GenerateToken();
                    user.save()
                        .then(saved => {
                            return HttpResponse.success(res, user, 'Vous êtes maintenant connecté');
                        })
                }
                return HttpResponse.error(res, 'Adresse e-mail ou mot de passe invalide', 404);
            })
    }

    private register(req: Request, res: Response) {

    }

}