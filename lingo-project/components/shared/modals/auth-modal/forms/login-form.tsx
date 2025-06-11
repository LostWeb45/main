"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { formLoginSchema, TFormLoginValues } from "./schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/shared/form/form-input";
import { Button } from "@/components/ui";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { DialogTitle } from "@/components/ui/dialog";

interface Props {
  className?: string;
  onClose: VoidFunction;
}

export const LoginForm: React.FC<Props> = ({ onClose, className }) => {
  const form = useForm<TFormLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TFormLoginValues) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: window.location.origin,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (!result?.ok) {
        throw new Error("Ошибка авторизации");
      }

      toast.success("Вы успешно вошли в аккаунт", { icon: "✅" });

      onClose?.();
    } catch (error) {
      toast.error("Неверный email или пароль", { icon: "❌" });
    } finally {
      form.reset();
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className={`flex flex-col gap-5 ${className || ""}`}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex justify-between items-center">
          <div className="mr-2">
            <DialogTitle className="text-[26px]">Вход в аккаунт</DialogTitle>
            <p className="text-gray-400">
              Введите свою почту, чтобы войти в аккаунт
            </p>
          </div>
          <img
            src="/images/phone-icon.png"
            alt="phone"
            width={60}
            height={60}
          />
        </div>

        <FormInput
          className="text-[17px]"
          name="email"
          label="E-Mail"
          type="email"
          required
        />
        <FormInput
          className="text-[17px]"
          name="password"
          label="Пароль"
          type="password"
          required
        />

        <Button
          className="h-[50px]"
          loading={form.formState.isSubmitting}
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          Войти
        </Button>
      </form>
    </FormProvider>
  );
};
