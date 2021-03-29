import {Express, Request, Response} from "express";
import {HttpResponse} from "../Utils/HttpResponse";
import {User} from "../Database/Models/User";
import {Crypto} from "../Utils/Crypto";
import {JWT} from "../Utils/JWT";

export class AuthController {

    constructor(app: Express) {
        app.post('/login', this.login);
        app.post('/register', this.register);
    }

    /**
     * POST /login
     * Connexion à l'aide d'une adresse e-mail et mot de passe
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
                    const jwt = JWT.encode(user.toJSON());
                    return HttpResponse.success(res, { jwt }, 'Vous êtes maintenant connecté');
                }
                return HttpResponse.error(res, 'Adresse e-mail ou mot de passe invalide', 404);
            })
    }

    /**
     * POST /register
     * Création d'un compte
     */
    private register(req: Request, res: Response) {
        const body = req.body;
        const neededParams = ['firstname', 'email', 'password', 'passwordConfirm'];
        if (!neededParams.every(itm => body.hasOwnProperty(itm))) {
            return HttpResponse.error(res, 'Veuillez remplir tous champs', 400);
        }
        if (body.password !== body.passwordConfirm) {
            return HttpResponse.error(res, 'Les mots de passes sont différents', 400);
        }
        const passwordHash = Crypto.hashPassword(body.password);
        return User.findOrCreate({ where: { email: body.email }, defaults: { firstname: body.firstname, password: passwordHash } })
            .then(user => {
                if (user[1]) {
                    return HttpResponse.success(res, null, 'Votre compte a été créé avec succès', 201);
                }
                return HttpResponse.error(res, 'Cette adresse e-mail est déjà utilisée', 400);
            })
    }

}
