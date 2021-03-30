import {Express, Request, Response} from "express";
import {User} from "../Database/Models/User";
import {Crypto} from "../Utils/Crypto";
import {HttpResponse} from "../Utils/HttpResponse";
import {TestsMiddleware} from "../Middlewares/TestsMiddleware";

export class UsersController {

    constructor(app: Express) {
        app.delete('/users/:id', TestsMiddleware.IsLoggedTests, this.DeleteOne);
    }

    private DeleteOne(req: Request, res: Response) {
        const id = req.params.id;
        if (id && !Crypto.isUuid(id)) {
            return HttpResponse.error(res, 'L\'identifiant est invalide', 400);
        }
        return User.destroy({ where: { id } })
            .then(deleted => {
                if (deleted) {
                    return HttpResponse.success(res, null, 'User deleted', 200);
                }
                return HttpResponse.error(res, 'User not found', 404);
            })
    }
}
