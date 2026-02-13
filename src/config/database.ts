import { Sequelize, Dialect } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbDialect = (process.env.DB_DIALECT || "postgres") as Dialect;

const sequelize = new Sequelize({
  dialect: dbDialect,
  storage: process.env.DB_STORAGE || ":memory:",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: false
});

export default sequelize;
