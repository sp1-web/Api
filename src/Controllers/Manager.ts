import {Express} from "express";
import {AuthController} from "./AuthController";
import {PromotionsController} from "./PromotionsController";
import {QrcodesController} from "./QrcodesController";
import {ConnectedUserController} from "./ConnectedUserController";
import {UsersController} from "./UsersController";
import {ArticlesController} from "./ArticlesController";

export class Manager {

    /**
     * Initialize all controllers
     * @param app
     */
    constructor(app: Express) {
        /**
         * Il serait interessant de faire un autoloader
         */
        new AuthController(app);
        new PromotionsController(app);
        new QrcodesController(app);
        new ConnectedUserController(app);
        new UsersController(app);
        new ArticlesController(app);
    }

}
