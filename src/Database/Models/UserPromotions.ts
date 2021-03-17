import {UUID} from "./Generic/UUID";
import {BelongsTo, Column, DataType, ForeignKey, Table} from "sequelize-typescript";
import {User} from "./User";
import {Promotion} from "./Promotion";

@Table
export class UserPromotion extends UUID {

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    user_id: string;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Promotion)
    @Column(DataType.UUID)
    promotion_id: string;

    @BelongsTo(() => Promotion)
    promotion: Promotion;
}
