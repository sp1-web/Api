import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Table} from "sequelize-typescript";
import {UUID} from "./Generic/UUID";
import {Qrcode} from "./Qrcode";
import {Article} from "./Article";

@Table
export class Promotion extends UUID {

    @ForeignKey(() => Qrcode)
    @Column(DataType.UUIDV4)
    qrcode_id: string;

    @BelongsTo(() => Qrcode)
    qrcode: Qrcode;

    @ForeignKey(() => Article)
    @Column(DataType.UUIDV4)
    article_id: string;

    @BelongsTo(() => Article)
    article: Article;

    @Column
    name: string;

    @Column
    code: string;

    @Column(DataType.DOUBLE)
    percentageReduction: number;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    generic: boolean;

    @Column
    expireAt: Date;

}
