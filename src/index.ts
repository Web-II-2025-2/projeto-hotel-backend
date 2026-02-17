import dotenv from "dotenv";
import sequelize from "./config/database";
import { createInitialAdmin } from "./config/adminSeed";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(async () => {
    console.log("Conectado ao banco de dados!");
    await sequelize.sync();
    await createInitialAdmin();
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });