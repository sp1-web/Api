import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import {IWebpackHotModule} from "./Interfaces/IWebpackHotModule";
import {Manager} from "./Controllers/Manager";
import {database} from "./Database/Models";


// Variables
declare const module: IWebpackHotModule;
const app = express();

// App config
app.use(cors());
app.use(express.json());

new Manager(app);

database.sync()
    .then(() => {
        const server = app.listen(parseInt(process.env.PORT), process.env.ADDRESS, () => {
            console.log(`Listening on ${ process.env.ADDRESS }:${ process.env.PORT }`);

            if (module.hot) {
                module.hot.accept();
                module.hot.dispose(() => server.close());
            }
        })
    })