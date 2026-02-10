import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface EmployeeAttributes {
  id: number;
  name: string;
  isActive: boolean;
  credentialId: number;
}

export interface EmployeeCreationAttributes
  extends Optional<EmployeeAttributes, "id" | "isActive"> {}

export class Employee
  extends Model<EmployeeAttributes, EmployeeCreationAttributes>
  implements EmployeeAttributes
{
  public id!: number;
  public name!: string;
  public isActive!: boolean;
  public credentialId!: number;

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
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    credentialId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "credentials",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    }
  },
  {
    sequelize,
    tableName: "employees",
    timestamps: true
  }
);

Employee.belongsTo(sequelize.models.Credential, { foreignKey: 'credentialId', as: 'credential' });

export default Employee;