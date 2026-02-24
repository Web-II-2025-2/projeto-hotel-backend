import dotenv from "dotenv";
import sequelize from "./config/database";
import { createInitialAdmin } from "./config/adminSeed";
import app from "./app";

import logger from "./utils/logger";
dotenv.config();

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(async () => {
    logger.info("Conectado ao banco de dados!");
    await sequelize.sync();
    await createInitialAdmin();
    
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
      logger.info(`Swagger disponível em http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    logger.error("Erro ao conectar ao banco de dados:", error);
  });