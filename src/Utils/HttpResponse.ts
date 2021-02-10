import {IHttpResponse} from "../Interfaces/IHttpResponse";
import {Response} from "express";

export class HttpResponse {

    private static responseData: IHttpResponse = { success: null, code: null, message: null, data: null };

    static error(res: Response, message: string = "Une erreur est survenue", code: number = 500) {
        return this.send(res, false, null, message, code);
    }

    static success(res: Response, data: any, message: string = null, code: number = 200) {
        return this.send(res, true, data, message, code);
    }

    static send(res: Response, success: boolean, data: any, message: string, code: number = 200) {
        const response: IHttpResponse = this.copyBaseResponse();
        response.data = data;
        response.message = message;
        response.code = code;
        response.success = success;
        return res.status(code).json(response);
    }

    private static copyBaseResponse(): IHttpResponse {
        return Object.assign({}, this.responseData);
    }

}