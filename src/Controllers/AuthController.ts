import {Express, Request, Response} from "express";
import {HttpResponse} from "../Utils/HttpResponse";
import {User} from "../Database/Models/User";
import {Crypto} from "../Utils/Crypto";

export class AuthController {

    constructor(app: Express) {
        app.post('/login', this.login);
        app.post('/register', this.register);
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
        const neededParams = ['email', 'password'];
        if (!neededParams.every(itm => body.hasOwnProperty(itm))) {
            return HttpResponse.error(res, 'Adresse e-mail ou mot de passe invalide', 404);
        }
        const passwordHash = Crypto.hashPassword(body.password);
        return User.findOne({
            where: { email: body.email, password: passwordHash },
            attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
        })
            .then(user => {
                if (user !== null) {
                    user.token = Crypto.generateToken();
                    return user.save()
                        .then(saved => {
                            return HttpResponse.success(res, saved.toJSON(), 'Vous êtes maintenant connecté');
                        })
                }
                return HttpResponse.error(res, 'Adresse e-mail ou mot de passe invalide', 404);
            })
    }

    /**
     * POST /register
     * Create an account
     * @param req
     * @param res
     * @private
     */
    private register(req: Request, res: Response) {
        const body = req.body;
        const neededParams = ['firstname', 'email', 'password', 'passwordConfirm'];
        if (!neededParams.every(itm => body.hasOwnProperty(itm))) {
            return HttpResponse.error(res, 'Veuillez remplir tous champs');
        }
        if (body.password !== body.passwordConfirm) {
            return HttpResponse.error(res, 'Les mots de passes sont différents');
        }
        const passwordHash = Crypto.hashPassword(body.password);
        return User.findOrCreate({ where: { email: body.email }, defaults: { firstname: body.firstname, password: passwordHash } })
            .then(user => {
                if (user[1]) {
                    return HttpResponse.success(res, null, 'Votre compte a été créé avec succès', 201);
                }
                return HttpResponse.error(res, 'Cette adresse e-mail est déjà utilisée');
            })
    }

}