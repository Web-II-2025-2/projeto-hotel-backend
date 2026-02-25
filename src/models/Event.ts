import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface EventAttributes {
  id: number;
  name: string;
  description: string;
  date: Date;
  time: string;
  capacity: number;
  location: string;
}

export interface EventCreationAttributes
  extends Optional<EventAttributes, "id"> {}

export class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public date!: Date;
  public time!: string;
  public capacity!: number;
  public location!: string;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "events",
    timestamps: true,
  }
);

export default Event;