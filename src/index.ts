import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database";
import { setupSwagger } from "./config/swagger";
import userRoutes from "./routes/userRoutes";
import { roomRoutes } from "./routes/roomRoutes"; 
import { employeeRoutes } from "./routes/employeeRoutes";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { reservationRoutes } from "./routes/reservationRoutes";
import { eventRoutes } from "./routes/eventRoutes";
import authRoutes from "./routes/authRoutes";
import { authenticate } from "./middleware/authMiddleware";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

setupSwagger(app);
app.use(authenticate);
app.use("/users", userRoutes);
app.use("/rooms", roomRoutes);
app.use("/employees", employeeRoutes);
app.use("/reservations", reservationRoutes);
app.use("/events", eventRoutes);
app.use(errorMiddleware); 

sequelize
  .authenticate()
  .then(() => {
    console.log("Conectado ao banco de dados!");

    return sequelize.sync(); 
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });
