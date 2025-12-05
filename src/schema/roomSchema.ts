// src/schemas/room.schemas.ts
import { z } from 'zod';
import { RoomType } from "../enums/RoomType";
import { RoomStatus } from "../enums/RoomStatus";


export const roomCreationSchema = z.object({
  number: z.string().min(1, "O número do quarto é obrigatório."),

  type: z.nativeEnum(RoomType)
    .refine((val) => Object.values(RoomType).includes(val), {
      message: "Tipo de quarto inválido. Use um dos valores permitidos.",
    }),

  dailyRate: z.number().positive("A tarifa diária deve ser um valor positivo."),
  
  status: z.nativeEnum(RoomStatus)
    .refine((val) => val === undefined || Object.values(RoomStatus).includes(val), {
      message: "Status de quarto inválido.",
    })
    .optional(),
});

export type RoomCreationDTO = z.infer<typeof roomCreationSchema>;

const baseRoomUpdateSchema = roomCreationSchema.partial();

export const roomUpdateSchema = baseRoomUpdateSchema.refine(
  (data) => Object.keys(data).length > 0, 
  {
    message: "A requisição de atualização deve conter pelo menos um campo para ser atualizado.",
    path: ['body'], 
  }
);

export type RoomUpdateDTO = z.infer<typeof roomUpdateSchema>;