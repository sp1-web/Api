import {UUID} from "./Generic/UUID";
import {BelongsTo, Column, DataType, DeletedAt, ForeignKey, Table} from "sequelize-typescript";
import {User} from "./User";
import {Promotion} from "./Promotion";

@Table({ tableName: "User_Promotions" })
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

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    used: boolean;

    @DeletedAt
    deletedAt: Date;

}
