import { Request } from "express";

export interface IHttpRequest extends Request {
    account: any;
}