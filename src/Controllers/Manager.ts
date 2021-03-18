import {Express} from "express";
import {AuthController} from "./AuthController";
import {PromotionsController} from "./PromotionsController";
import {QrCodesController} from "./QrCodesController";

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
        new QrCodesController(app);
    }

}
