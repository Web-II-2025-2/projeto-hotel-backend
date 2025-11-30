import { Router } from "express";
import { RoomController } from "../controllers/RoomController";

const router = Router();
const controller = new RoomController();

/**
 * @swagger
 * components:
 *  schemas:
 *   Room:
 *    type: object
 *    required:
 *    - number
 *    - type
 *    - status
 *    - dailyRate
 *    properties:
 *      id:
 *        type: integer
 *        description: ID gerado automaticamente
 *        example: 1
 *      number:
 *        type: string
 *        description: Número ou identificador do quarto
 *        example: "101-A"
 *      type:
 *        type: string
 *        description: Categoria do quarto
 *        enum: [STANDARD, SUITE, DELUXE] 
 *        example: SUITE
 *      status:
 *        type: string
 *        description: Estado atual do quarto
 *        enum: [AVAILABLE, OCCUPIED, DIRTY, CLEANING, MAINTENANCE]
 *        example: AVAILABLE
 *      dailyRate:
 *        type: number
 *        format: float
 *        description: Valor da diária
 *        example: 350.00
 */

/**
 * @swagger
 * tags:
 * - name: Rooms
 *      description: API de gerenciamento de quartos
 */

/**
 * @swagger
 * /rooms:
 *  post:
 *   summary: Cria um novo quarto
 *   tags: [Rooms]
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/Room'
 *   responses:
 *    201:
 *     description: O quarto foi criado com sucesso.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Room'
 * 400:
 * description: Erro na criação do quarto (ex: Número duplicado).
 */
router.post("/", controller.createRoom.bind(controller));

/**
 * @swagger
 * /rooms:
 *      get:
 *      summary: Retorna a lista de todos os quartos
 *      tags: [Rooms]
 *      responses:
 *        200:
 *          description: Lista de quartos.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Room'
 */
router.get("/", controller.getAllRooms.bind(controller));

/**
 * @swagger
 * /rooms/{id}:
 *      get:
 *      summary: Busca um quarto pelo ID
 *      tags: [Rooms]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: O ID do quarto
 *      responses:
 *        200:
 *          description: Detalhes do quarto.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Room'
 *        404:
 *          description: Quarto não encontrado.
 */
router.get("/:id", controller.getRoom.bind(controller));

/**
 * @swagger
 * /rooms/{id}:
 *      put:
 *      summary: Atualiza um quarto existente (Substituição total)
 *      tags: [Rooms]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: O ID do quarto
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Room'
 *      responses:
 *        200:
 *          description: O quarto foi atualizado.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Room'
 *        404:
 *          description: Quarto não encontrado.
 */
router.put("/:id", controller.updateRoom.bind(controller));

/**
 * @swagger
 * /rooms/{id}:
 *      delete:
 *      summary: Deleta um quarto
 *      tags: [Rooms]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: O ID do quarto
 *      responses:
 *        204:
 *          description: Quarto deletado com sucesso.
 *        404:
 *          description: Quarto não encontrado.
 */
router.delete("/:id", controller.deleteRoom.bind(controller));

export { router as roomRoutes };