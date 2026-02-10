import { Router } from "express";
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

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do usuário
 *     responses:
 *       200:
 *         description: Detalhes do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado.
 */
router.get("/:id", authenticate, authorize(AccessLevel.EMPLOYEE), controller.getGuest.bind(controller));

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: O usuário foi atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado.
 */
router.put("/:id", authenticate, authorize(AccessLevel.GUEST), validateDTO(userUpdateSchema), controller.updateGuest.bind(controller));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deleta um usuário
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do usuário
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 */
router.delete("/:id", authenticate, authorize(AccessLevel.AUTHENTICATED), controller.deleteGuest.bind(controller));

export { router as guestRoutes };
