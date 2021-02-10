import {Express} from "express";
import {ExampleController} from "./ExampleController";

export class Manager {

    /**
     * Initialize all controllers
     * @param app
     */
    constructor(app: Express) {
        new ExampleController().routes(app);
    }

}