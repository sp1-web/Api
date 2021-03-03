import {Express} from "express";
import {ExampleController} from "./ExampleController";
import {AuthController} from "./AuthController";

export class Manager {

    /**
     * Initialize all controllers
     * @param app
     */
    constructor(app: Express) {
        /**
         * Il serait interessant de faire un autoloader
         */
        new ExampleController(app);
        new AuthController(app);
    }

}