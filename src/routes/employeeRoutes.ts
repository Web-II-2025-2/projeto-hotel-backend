import { Router } from "express";
import { EmployeeController } from "../controllers/EmployeeController";
import { employeeCreationSchema, employeeUpdateSchema } from '../schema/employeeSchema';
import { validateDTO } from '../middleware/validate.middleware';
import { authenticate } from "../middleware/authMiddleware";
import { authorize } from "../middleware/authMiddleware";
import { AccessLevel } from "../constants/roles";


const router = Router();
const controller = new EmployeeController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Nome completo do funcionário
 *           example: "Carlos Gerente"
 *         email:
 *           type: string
 *           format: email
 *           description: Email corporativo (login)
 *           example: "carlos@hotel.com"
 *         password:
 *           type: string
 *           format: password
 *           description: Senha de acesso (não retornada em respostas protegidas)
 *           example: "senhaSegura123"
 *         isActive:
 *           type: boolean
 *           description: Define se o funcionário está ativo no sistema
 *           default: true
 *           example: true
 */

/**
 * @swagger
 * tags:
 *   - name: Employees
 *     description: Gestão de funcionários e permissões
 */

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Lista todos os funcionários
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: Lista de funcionários.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 */
router.get("/", authenticate, authorize(AccessLevel.MANAGER), controller.getAllEmployees.bind(controller));

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Busca um funcionário pelo ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do funcionário
 *     responses:
 *       200:
 *         description: Dados do funcionário.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Funcionário não encontrado.
 */
router.get("/:id", authenticate, authorize(AccessLevel.EMPLOYEE), controller.getEmployee.bind(controller));

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Atualiza dados de um funcionário
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do funcionário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       200:
 *         description: Funcionário atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Funcionário não encontrado.
 */
router.put("/:id", authenticate, authorize(AccessLevel.EMPLOYEE), validateDTO(employeeUpdateSchema), controller.updateEmployee.bind(controller));

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Remove um funcionário
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do funcionário
 *     responses:
 *       204:
 *         description: Funcionário removido com sucesso.
 *       404:
 *         description: Funcionário não encontrado.
 */
router.delete("/:id", authenticate, authorize(AccessLevel.MANAGER), controller.deleteEmployee.bind(controller));

router.patch("/:id_room", authenticate, authorize(AccessLevel.EMPLOYEE), controller.cleanRoom.bind(controller));

export { router as employeeRoutes };