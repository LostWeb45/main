"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formRegisterSchema, TFormRegisterValues } from "./schemas";
import { FormInput } from "@/components/shared/form/form-input";
import { Button } from "@/components/ui";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { DialogTitle } from "@/components/ui/dialog";

interface Props {
  className?: string;
  onClose: VoidFunction;
}

export const RegisterForm: React.FC<Props> = ({ onClose, className }) => {
  const form = useForm<TFormRegisterValues>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: TFormRegisterValues) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        toast.error(result?.message || "Ошибка при регистрации", {
          icon: "❌",
        });
        return;
      }

      toast.success("Вы успешно зарегистрированы", { icon: "✅" });

      const loginResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: window.location.origin,
      });

      if (loginResult?.error) {
        throw new Error(loginResult.error);
      }

      toast.success("Вы успешно вошли в аккаунт", { icon: "✅" });

      onClose?.();
    } catch (error) {
      console.log(error);
      toast.error("Произошла ошибка при регистрации", { icon: "❌" });
    } finally {
      form.reset();
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className={`flex flex-col gap-1 sm:gap-5 ${className || ""}`}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex justify-between items-center">
          <div className="mr-2">
          <DialogTitle className="sm:text-[26px]">Регистрация</DialogTitle>
            <p className="hidden sm:block text-gray-400">
              Введите свои данные для регистрации
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
          name="name"
          label="Имя"
          type="text"
          required
        />

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

        <FormInput
          className="text-[17px]"
          name="confirmPassword"
          label="Подтверждение пароля"
          type="password"
          required
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...form.register("acceptTerms")}
            className="accent-[#3a5f9d] w-5 h-5"
            id="acceptTerms"
          />
          <label htmlFor="acceptTerms" className="text-sm text-gray-700">
            Я принимаю{" "}
            <a
              href="/policy"
              target="_blank"
              className="text-[#3a5f9d] underline"
            >
              условия обработки персональных данных
            </a>
          </label>
        </div>
        {form.formState.errors.acceptTerms && (
          <p className="text-red-500 text-sm -mt-3">
            {form.formState.errors.acceptTerms.message}
          </p>
        )}

        <Button
          className="h-[50px]"
          loading={form.formState.isSubmitting}
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          Зарегистрироваться
        </Button>
      </form>
    </FormProvider>
  );
};
