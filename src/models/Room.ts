import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";
import { RoomStatus } from "../enums/RoomStatus";
import { RoomType } from "../enums/RoomType";

export interface RoomAttributes {
    id: number;
    number: string;
    type: RoomType;
    status: RoomStatus;
    dailyRate: number;
}

export interface RoomCreationAttributes
    extends Optional<RoomAttributes, "id"> {}

export class Room
    extends Model<RoomAttributes, RoomCreationAttributes>
    implements RoomAttributes
{
    public id!: number;
    public number!: string;
    public type!: RoomType;
    public status!: RoomStatus;
    public dailyRate!: number;
}


Room.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        type: {
            type: DataTypes.ENUM(...Object.values(RoomType)),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(RoomStatus)),
            allowNull: false,
            defaultValue: RoomStatus.AVAILABLE
        },
        dailyRate: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: "rooms",
        timestamps: false
    }
)

export default Room;