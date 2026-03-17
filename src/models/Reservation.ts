import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";
import { ReservationStatus } from "../enums/ReservationStatus";

export interface ReservationAttributes {
    id: number;
    guestId: number; 
    roomId: number; 
    checkIn: Date;
    checkOut: Date;
    totalPrice: number;
    status: ReservationStatus;
    isCleaningRequested?: boolean; 
}

export interface ReservationCreationAttributes
    extends Optional<ReservationAttributes, "id" | "status" | "isCleaningRequested"> {}

export class Reservation
    extends Model<ReservationAttributes, ReservationCreationAttributes>
    implements ReservationAttributes
{
    public id!: number;
    public guestId!: number;
    public roomId!: number;
    public checkIn!: Date;
    public checkOut!: Date;
    public totalPrice!: number;
    public status!: ReservationStatus;
    public isCleaningRequested?: boolean;
}

Reservation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        guestId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'guests', key: 'id' }
        },
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'rooms', key: 'id' }
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
        },
        isCleaningRequested: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        sequelize,
        tableName: "reservations",
        timestamps: true 
    }
);