import {UUID} from "./Generic/UUID";
import {Column, DataType, Table} from "sequelize-typescript";

@Table
export class Article extends UUID {

    @Column
    name: string;

    @Column
    description: string;

    @Column(DataType.STRING(255))
    img: string;

    @Column(DataType.DOUBLE)
    price: number;

}