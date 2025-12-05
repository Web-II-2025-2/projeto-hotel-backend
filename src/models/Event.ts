import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface EventAttributes {
  id: number;
  local: string;
  horario: string; 
  data: Date; 
}

export interface EventCreationAttributes
  extends Optional<EventAttributes, "id"> {}

export class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  public id!: number;
  public local!: string;
  public horario!: string;
  public data!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    local: {
      type: DataTypes.STRING,
      allowNull: false
    },
    horario: {
      type: DataTypes.TIME,
      allowNull: false
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "events",
    timestamps: false
  }
);

export default Event;