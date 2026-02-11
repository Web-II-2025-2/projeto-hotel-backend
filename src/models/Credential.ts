import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";
import { RoleType } from "../enums/RoleType";

export interface CredentialAttributes {
    id: number;
    email: string;
    passwordHash: string;
    role: RoleType;
}

export interface CredentialCreationAttributes
    extends Optional<CredentialAttributes, "id"> { }

export class Credential
    extends Model<CredentialAttributes, CredentialCreationAttributes>
    implements CredentialAttributes {
    public id!: number;
    public email!: string;
    public passwordHash!: string;
    public role!: RoleType;
}

Credential.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM(...Object.values(RoleType)),
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "Credential",
        tableName: "credentials",
        timestamps: false
    }
);