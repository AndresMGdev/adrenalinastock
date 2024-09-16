// src/lib/validations.ts
import * as z from "zod";

export const loginSchema = z.object({
    email: z
      .string()
      .email("Correo electrónico inválido")
      .min(1, "El campo correo electrónico es requerido"),
    password: z
      .string()
      .max(6, "La contraseña debe tener al menos 6 caracteres")
      .min(1, "El campo contraseña es requerido"),
  });