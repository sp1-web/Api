import {Sequelize} from "sequelize-typescript";

const config: any = {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: JSON.parse(process.env.DB_LOGGING),
    models: []
};

export const database = new Sequelize(config);