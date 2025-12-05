// src/schemas/employee.schemas.ts
import { z } from 'zod';


export const employeeCreationSchema = z.object({
  
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  
  email: z.string().email("Formato de e-mail inválido."),
  
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  
  isActive: z.boolean().optional(),
});

export type EmployeeCreationDTO = z.infer<typeof employeeCreationSchema>;

const baseEmployeeUpdateSchema = employeeCreationSchema.partial();

export const employeeUpdateSchema = baseEmployeeUpdateSchema.refine(
  (data) => Object.keys(data).length > 0, 
  {
    message: "A requisição de atualização deve conter pelo menos um campo para ser atualizado.",
    path: ['body'], 
  }
);

export type EmployeeUpdateDTO = z.infer<typeof employeeUpdateSchema>;