import {Express} from "express";

export interface IController {

    /**
     * Route prefix before all routes of controller
     */
    routePrefix: string;

    /**
     * Initialize all routes of controller
     * @param app Express application
     */
    routes(app: Express);

}
