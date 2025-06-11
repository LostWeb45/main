import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(4, { message: "Введите корректный пароль" });

export const formLoginSchema = z.object({
  email: z.string().email({ message: "Введите корректную почту" }),
  password: passwordSchema,
});

export const formRegisterSchema = z
  .object({
    name: z.string().min(2, "Имя обязательно"),
    email: z.string().email("Некорректный email"),
    password: z.string().min(6, "Минимум 6 символов"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "Вы должны принять условия" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают",
  });

export const formUpdateSchema = z
  .object({
    email: z.string().email({ message: "Введите корректную почту" }),
    name: z.string().min(2, { message: "Введите корректное имя" }),
    password: z
      .string()
      .min(4, { message: "Введите корректный пароль" })
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export const formResetPasswordSchema = z
  .object({
    email: z.string().email({ message: "Введите корректную почту" }),
    code: z.string().min(6, { message: "Введите код из письма" }),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type TFormUpdateValues = z.infer<typeof formUpdateSchema>;
export type TFormLoginValues = z.infer<typeof formLoginSchema>;
export type TFormRegisterValues = z.infer<typeof formRegisterSchema>;
export type TFormResetPasswordValues = z.infer<typeof formResetPasswordSchema>;
