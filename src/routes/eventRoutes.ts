import { Router } from "express";
import { EventController } from "../controllers/EventController";

const router = Router();
const controller = new EventController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - local
 *         - horario
 *         - data
 *       properties:
 *         local:
 *           type: string
 *           description: Local onde o evento ocorrerá
 *           example: "Auditório Principal"
 *         horario:
 *           type: string
 *           format: time
 *           description: Horário do evento (HH:mm:ss)
 *           example: "18:30:00"
 *         data:
 *           type: string
 *           format: date
 *           description: Data do evento
 *           example: "2024-10-15"
 */

/**
 * @swagger
 * tags:
 *   - name: Events
 *     description: API de gerenciamento de eventos
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Cria um novo evento
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Evento criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Erro na criação do evento.
 */
router.post("/", controller.createEvent.bind(controller));

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retorna a lista de todos os eventos
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Lista de eventos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get("/", controller.getAllEvents.bind(controller));

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Busca um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado.
 */
router.get("/:id", controller.getEvent.bind(controller));

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualiza um evento existente
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Evento atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado.
 */
router.put("/:id", controller.updateEvent.bind(controller));

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Deleta um evento
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do evento
 *     responses:
 *       204:
 *         description: Evento deletado com sucesso.
 *       404:
 *         description: Evento não encontrado.
 */
router.delete("/:id", controller.deleteEvent.bind(controller));

export { router as eventRoutes };
