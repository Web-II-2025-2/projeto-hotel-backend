import { RequestHandler, Router } from "express";
import { GuestController } from "../controllers/GuestController";
import { validateDTO } from '../middleware/validate.middleware';
import { userCreationSchema, userUpdateSchema} from '../schema/userSchema';
import { authenticate } from "../middleware/authMiddleware";
import { authorize } from "../middleware/authMiddleware";
import { AccessLevel } from "../constants/roles";

const router = Router();
const controller = new GuestController();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - cpf
 *       properties:
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *           example: Victor Silva
 *         email:
 *           type: string
 *           description: Email do usuário
 *           example: victor@email.com
 *         cpf:
 *           type: string
 *           description: CPF do usuário
 *           example: "123.456.789-00"
 *         phoneNumber:
 *           type: string
 *           description: Telefone de contato
 *           example: "(83) 99999-9999"
 */

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API de gerenciamento de usuários
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna a lista de todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", authenticate, authorize(AccessLevel.EMPLOYEE), controller.getAllGuests.bind(controller));

router.get("/profile", authenticate, authorize(AccessLevel.GUEST), (controller.getGuest as unknown as RequestHandler));

router.put("/profile", authenticate, authorize(AccessLevel.GUEST), validateDTO(userUpdateSchema), (controller.updateGuest as unknown as RequestHandler));

router.delete("/profile", authenticate, authorize(AccessLevel.GUEST), (controller.deleteGuest as unknown as RequestHandler));
export { router as guestRoutes };
