import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Table} from "sequelize-typescript";
import {UUID} from "./Generic/UUID";
import {QrCode} from "./QrCode";
import {Article} from "./Article";

@Table
export class Promotion extends UUID {

    @ForeignKey(() => QrCode)
    @Column(DataType.UUIDV4)
    qrcode_id: string;

    @BelongsTo(() => QrCode)
    qrcode: QrCode;

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

}