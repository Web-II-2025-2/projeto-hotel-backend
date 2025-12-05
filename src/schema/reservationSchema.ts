import { z } from 'zod';
import { ReservationStatus } from "../enums/ReservationStatus"; // Importe seu ENUM

const checkOutAfterCheckIn = (
  schema: z.ZodObject<{
    checkIn: z.ZodTypeAny;
    checkOut: z.ZodTypeAny;
  }>
) =>
  schema.refine((data) => (data.checkOut as Date) > (data.checkIn as Date), {
    message: "A data de check-out deve ser posterior à data de check-in.",
    path: ["checkOut"],
  });

const baseReservationSchema = z.object({
  
  userId: z.number()        
    .int("O ID do usuário deve ser um número inteiro.")
    .positive("O ID do usuário deve ser um valor positivo.")
    .refine((val) => val !== undefined && val !== null, {
      message: "O ID do usuário é obrigatório.",
    }),
    
  roomId: z.number()
    .int("O ID do quarto deve ser um número inteiro.")
    .positive("O ID do quarto deve ser um valor positivo.")
    .refine((val) => val !== undefined && val !== null, {
      message: "O ID do quarto é obrigatório.",
    }),

  checkIn: z.coerce.date()
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: "Formato de data de check-in inválido.",
    }),
  
  checkOut: z.coerce.date()
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: "Formato de data de check-out inválido.",
    }),
  
  totalPrice: z.number()
    .positive("O preço total deve ser positivo.")
    .refine((val) => val !== undefined && val !== null, {
      message: "O preço total é obrigatório.",
    }),
  
  status: z.nativeEnum(ReservationStatus)
    .refine((val) => Object.values(ReservationStatus).includes(val), {
      message: "Status de reserva inválido.",
    })
    .optional(),
});

export const reservationCreationSchema = checkOutAfterCheckIn(baseReservationSchema);

export type reservationCreationDTO = z.infer<typeof reservationCreationSchema>;

const baseReservationUpdateSchema = baseReservationSchema.partial();

export const reservationUpdateSchema = baseReservationUpdateSchema.refine(
  (data) => Object.keys(data).length > 0, 
  {
    message: "A requisição de atualização deve conter pelo menos um campo.",
    path: ['body'], 
  }
);

export type reservationUpdateDto = z.infer<typeof reservationUpdateSchema>;