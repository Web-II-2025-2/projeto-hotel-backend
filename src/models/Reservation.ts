import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";
import { User } from "./User";
import { Room } from "./Room";
import { ReservationStatus } from "../enums/ReservationStatus";

export interface ReservationAttributes {
    id: number;
    userId: number; 
    roomId: number; 
    checkIn: Date;
    checkOut: Date;
    totalPrice: number;
    status: ReservationStatus;
}

export interface ReservationCreationAttributes
    extends Optional<ReservationAttributes, "id" | "status"> {}

export class Reservation
    extends Model<ReservationAttributes, ReservationCreationAttributes>
    implements ReservationAttributes
{
    public id!: number;
    public userId!: number;
    public roomId!: number;
    public checkIn!: Date;
    public checkOut!: Date;
    public totalPrice!: number;
    public status!: ReservationStatus;
}

Reservation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', 
                key: 'id'
            }
        },
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'rooms', 
                key: 'id'
            }
        },
        checkIn: {
            type: DataTypes.DATE,
            allowNull: false
        },
        checkOut: {
            type: DataTypes.DATE,
            allowNull: false
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(ReservationStatus)),
            defaultValue: ReservationStatus.CONFIRMED
        }
    },
    {
        sequelize,
        tableName: "reservations",
        timestamps: true 
    }
);

Reservation.belongsTo(User, { foreignKey: 'userId', as: 'guest' });
Reservation.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

export default Reservation;