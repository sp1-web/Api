import {Column, DataType, Table} from "sequelize-typescript";
import {UUID} from "./Generic/UUID";

@Table
export class User extends UUID {

    @Column
    firstname: string;

    @Column
    email: string;

    @Column(DataType.TEXT)
    password: string;

    @Column(DataType.TEXT)
    token: string;

}