import { z } from "zod";

/**
 * Schema de validação para produtos
 */
export const productSchema = z.object({
  name: z.string().min(1, "Nome do produto é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
});

export type ProductData = z.infer<typeof productSchema>; 