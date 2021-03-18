import {Express} from "express";
import {AuthController} from "./AuthController";
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
        new QrCodesController(app);
    }

}
