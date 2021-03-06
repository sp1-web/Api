import {Column, HasMany, Table} from "sequelize-typescript";
import {UUID} from "./Generic/UUID";
import {Promotion} from "./Promotion";

@Table
export class Qrcode extends UUID {

    @Column
    name: string;

    @Column
    token: string;

    @HasMany(() => Promotion)
    promotions: Promotion[]
}
