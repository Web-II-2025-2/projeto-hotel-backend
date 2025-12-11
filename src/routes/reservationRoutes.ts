import { Router } from "express";
import { ReservationController } from "../controllers/ReservationController";
import { validateDTO } from '../middleware/validate.middleware';
import { reservationCreationSchema, reservationUpdateSchema } from "../schema/reservationSchema";

const router = Router();
const controller = new ReservationController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - userId
 *         - roomId
 *         - checkIn
 *         - checkOut
 *       properties:
 *         userId:
 *           type: integer
 *           description: ID do usuário responsável pela reserva
 *           example: 1
 *         roomId:
 *           type: integer
 *           description: ID do quarto reservado
 *           example: 5
 *         checkIn:
 *           type: string
 *           format: date-time
 *           description: Data de entrada
 *           example: "2023-12-20T14:00:00.000Z"
 *         checkOut:
 *           type: string
 *           format: date-time
 *           description: Data de saída
 *           example: "2023-12-25T12:00:00.000Z"
 *         totalPrice:
 *           type: number
 *           format: float
 *           description: Preço total calculado (Retornado pelo sistema)
 *           example: 1250.00
 *           readOnly: true
 *         status:
 *           type: string
 *           description: Status atual da reserva
 *           enum:
 *             - CONFIRMED
 *             - CANCELED
 *             - CHECKED_IN
 *             - CHECKED_OUT
 *           example: CONFIRMED
 *           readOnly: true
 */

/**
 * @swagger
 * tags:
 *   - name: Reservations
 *     description: API de gerenciamento de reservas
 */

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Cria uma nova reserva
 *     tags: [Reservations]
 *     description: Cria uma reserva verificando disponibilidade e calculando o preço total automaticamente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Erro de validação (datas inválidas, quarto ocupado, usuário inexistente).
 *       409:
 *         description: O quarto já está ocupado nos dias escolhidos.
 */
router.post("/", validateDTO(reservationCreationSchema), controller.createReservation.bind(controller));

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Retorna a lista de todas as reservas
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: Lista de reservas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get("/", controller.getAllReservations.bind(controller));

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Busca uma reserva pelo ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da reserva
 *     responses:
 *       200:
 *         description: Detalhes da reserva.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reserva não encontrada.
 */
router.get("/:id", controller.getReservation.bind(controller));

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Atualiza uma reserva existente
 *     tags: [Reservations]
 *     description: Permite alterar datas ou quarto. O preço será recalculado. Não é possível alterar reservas canceladas ou finalizadas.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Reserva atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Erro de validação ou conflito de agenda.
 *       404:
 *         description: Reserva não encontrada.
 */
router.put("/:id", validateDTO(reservationUpdateSchema), controller.updateReservation.bind(controller));

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Cancela uma reserva
 *     tags: [Reservations]
 *     description: Altera o status da reserva para CANCELED. Não deleta o registro do banco.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da reserva
 *     responses:
 *       204:
 *         description: Reserva cancelada com sucesso.
 *       400:
 *         description: Não é possível cancelar uma reserva já finalizada.
 *       404:
 *         description: Reserva não encontrada.
 */
router.delete("/:id", controller.deleteReservation.bind(controller));

export { router as reservationRoutes };
