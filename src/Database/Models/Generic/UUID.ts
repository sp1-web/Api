import {Column, CreatedAt, DataType, IsUUID, Model, PrimaryKey, UpdatedAt} from "sequelize-typescript";

export class UUID extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({ defaultValue: DataType.UUIDV4 })
    id: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

}