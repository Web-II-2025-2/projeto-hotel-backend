import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface EmployeeAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
}

export interface EmployeeCreationAttributes
  extends Optional<EmployeeAttributes, "id" | "isActive"> {}

export class Employee
  extends Model<EmployeeAttributes, EmployeeCreationAttributes>
  implements EmployeeAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Employee.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "employees",
    timestamps: true
  }
);

export default Employee;