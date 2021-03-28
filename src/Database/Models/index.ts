import {Sequelize} from "sequelize-typescript";
import {Article} from "./Article";
import {Promotion} from "./Promotion";
import {QrCode} from "./QrCode";
import {User} from "./User";
import {UserPromotion} from "./UserPromotion";

const config: any = {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: process.env.DB_LOGGING === 'true',
    models: [
        Article,
        Promotion,
        QrCode,
        User,
        UserPromotion
    ]
};

export const database = new Sequelize(config);
