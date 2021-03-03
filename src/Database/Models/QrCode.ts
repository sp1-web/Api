import {Column, Table} from "sequelize-typescript";
import {UUID} from "./Generic/UUID";

@Table
export class QrCode extends UUID {

    @Column
    name: string;

    @Column
    token: string;
    
}