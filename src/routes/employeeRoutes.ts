import { Router } from "express";
import { EmployeeController } from "../controllers/EmployeeController";
import { employeeCreationSchema, employeeUpdateSchema } from '../schema/employeeSchema';
import { validateDTO } from '../middleware/validate.middleware';

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
 *   post:
 *     summary: Cadastra um novo funcionário
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       201:
 *         description: Funcionário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       409:
 *         description: "Erro de validação (ex: Email duplicado)."
 */
router.post("/", validateDTO(employeeCreationSchema), controller.createEmployee.bind(controller));

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
router.get("/", controller.getAllEmployees.bind(controller));

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
router.get("/:id", controller.getEmployee.bind(controller));

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
router.put("/:id", validateDTO(employeeUpdateSchema), controller.updateEmployee.bind(controller));

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
router.delete("/:id", controller.deleteEmployee.bind(controller));

export { router as employeeRoutes };