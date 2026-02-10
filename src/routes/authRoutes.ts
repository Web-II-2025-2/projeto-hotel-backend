import express from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticate } from "../middleware/authMiddleware";
import { authorize } from "../middleware/authMiddleware";
import { RoleType } from "../enums/RoleType";

const router = express.Router();
const authController = new AuthController();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginDTO'
 *           example:
 *             email: user@email.com
 *             password: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", authController.login);

router.post("/register-employee", authenticate, authorize([RoleType.MANAGER, RoleType.ADMIN]), authController.register_employee);
router.post("/register-manager", authenticate, authorize([RoleType.ADMIN]), authController.register_manager);
router.post("/register-guest", authController.register_guest);

export default router;
