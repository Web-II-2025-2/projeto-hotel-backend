import express from "express";
import dotenv from "dotenv";
import { setupSwagger } from "./config/swagger";
import { guestRoutes } from "./routes/guestRoutes";
import { roomRoutes } from "./routes/roomRoutes"; 
import { employeeRoutes } from "./routes/employeeRoutes";
import { errorMiddleware } from "./middleware/errorMiddleware";
import logger from "./utils/logger";
import { logMiddleware } from "./middleware/logMiddleware";
import { reservationRoutes } from "./routes/reservationRoutes";
import { eventRoutes } from "./routes/eventRoutes";
import authRoutes from "./routes/authRoutes";
import { authenticate } from "./middleware/authMiddleware";
import { generalLimiter } from "./config/rateLimit";
import cors from "cors";
import { corsOptions } from "./config/cors";

dotenv.config();

const app = express();

app.use(cors(corsOptions));

app.use(express.json());
app.use(logMiddleware);

app.use(generalLimiter);

app.use('/auth', authRoutes);

setupSwagger(app);
app.use(authenticate);
app.use("/guests", guestRoutes);
app.use("/rooms", roomRoutes);
app.use("/employees", employeeRoutes);
app.use("/reservations", reservationRoutes);
app.use("/events", eventRoutes);
app.use(errorMiddleware); 

export default app;