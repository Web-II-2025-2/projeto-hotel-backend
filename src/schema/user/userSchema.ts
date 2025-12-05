import { z } from 'zod';


const cpfRegex = /^(\d{3}\.?\d{3}\.?\d{3}-?\d{2})$/;
export const userCreationSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  
  email: z.email("Formato de e-mail inválido."),
  
  cpf: z.string().regex(cpfRegex, "Formato de CPF inválido."),
  
  phoneNumber: z.string().min(8, "O telefone deve ter pelo menos 8 dígitos."),
  
});
export type UserCreationDTO = z.infer<typeof userCreationSchema>;

const baseUserUpdateSchema = userCreationSchema.partial();

export const userUpdateSchema = baseUserUpdateSchema.refine(
  (data) => Object.keys(data).length > 0, 
  {
    message: "A requisição de atualização deve conter pelo menos um campo para ser atualizado.",
    path: ['body'], 
  }
);

export type UserUpdateDTO = z.infer<typeof userUpdateSchema>;