import express, {NextFunction, Request, Response} from "express";
import cors from "cors";
import {Manager} from "./Controllers/Manager";
import * as swaggerDocument from "../swagger.json";
import {HttpResponse} from "./Utils/HttpResponse";
import swaggerUi from "swagger-ui-express";

const app = express();
app.set("port", process.env.PORT || 3000);
app.set("address", process.env.ADDRESS || "localhost");

// App config
app.use(cors());
app.use(express.json());

new Manager(app);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    return HttpResponse.error(res);
})

export default app;
