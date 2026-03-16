import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface RoomServiceRequestAttributes {
  id: number;
  reservationId: number;
  roomId: number;
  guestId: number;
  message: string;
  requestCleaning: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoomServiceRequestCreationAttributes
  extends Optional<RoomServiceRequestAttributes, "id" | "requestCleaning"> {}

export class RoomServiceRequest
  extends Model<RoomServiceRequestAttributes, RoomServiceRequestCreationAttributes>
  implements RoomServiceRequestAttributes
{
  public id!: number;
  public reservationId!: number;
  public roomId!: number;
  public guestId!: number;
  public message!: string;
  public requestCleaning!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RoomServiceRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reservationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "reservations",
        key: "id",
      },
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "rooms",
        key: "id",
      },
    },
    guestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "guests",
        key: "id",
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requestCleaning: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "room_service_requests",
    timestamps: true,
  }
);