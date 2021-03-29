import * as dotenv from "dotenv";
dotenv.config();
import {IWebpackHotModule} from "./Interfaces/IWebpackHotModule";
import {database} from "./Database/Models";
import app from './app';


// Variables
declare const module: IWebpackHotModule;

database.sync()
    .then(() => {
        const server = app.listen(parseInt(app.get("port")), app.get("address"), () => {
            console.log(`Listening on ${ process.env.ADDRESS }:${ process.env.PORT }`);

            if (module.hot) {
                module.hot.accept();
                module.hot.dispose(() => server.close());
            }
        })
    })
