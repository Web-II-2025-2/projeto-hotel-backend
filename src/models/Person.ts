import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface PersonAttributes {
    id: number;
    email: string;
    passwordHash: string;
    userId: number;
}

export interface PersonCreationAttributes
    extends Optional<PersonAttributes, "id"> { }

export class Person
    extends Model<PersonAttributes, PersonCreationAttributes>
    implements PersonAttributes {
    public id!: number;
    public email!: string;
    public passwordHash!: string;
    public userId!: number;
}

Person.init(
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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id"
            },
            onDelete: "CASCADE"
        }
    },
    {
        sequelize,
        tableName: "user_login_info",
        timestamps: false
    }
);
