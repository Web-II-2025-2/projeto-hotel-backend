import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface GuestAttributes {
  id: number;
  name: string;
  cpf: string;
  phoneNumber: string;
  credentialId: number;
}

export interface GuestCreationAttributes
  extends Optional<GuestAttributes, "id"> {}

export class Guest
  extends Model<GuestAttributes, GuestCreationAttributes>
  implements GuestAttributes
{
  public id!: number;
  public name!: string;
  public cpf!: string;
  public phoneNumber!: string;
  public credentialId!: number;
}


Guest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
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
    tableName: "guests",
    timestamps: false
  }
);

Guest.belongsTo(sequelize.models.Credential, { foreignKey: 'credentialId', as: 'credential' });

export default Guest;