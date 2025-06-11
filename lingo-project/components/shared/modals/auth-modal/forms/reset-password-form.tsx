"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { formResetPasswordSchema, TFormResetPasswordValues } from "./schemas";
import { FormInput } from "@/components/shared/form/form-input";
import { Button } from "@/components/ui";
import toast from "react-hot-toast";

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const codeFromUrl = searchParams.get("code") || "";

  const form = useForm<TFormResetPasswordValues>({
    resolver: zodResolver(formResetPasswordSchema),
    defaultValues: {
      email: "",
      code: codeFromUrl,
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (codeFromUrl) {
      form.setValue("code", codeFromUrl);
    }
  }, [codeFromUrl, form]);

  const onSubmit = async (data: TFormResetPasswordValues) => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err?.error || "Ошибка сброса пароля");
        return;
      }

      toast.success("Пароль успешно обновлён.");
      form.reset();

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (e) {
      toast.error("Ошибка сервера");
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormInput name="email" label="E-Mail" type="email" required />
        <FormInput name="code" label="Код из письма" required />
        <FormInput
          name="password"
          label="Новый пароль"
          type="password"
          required
        />
        <FormInput
          name="confirmPassword"
          label="Подтвердите пароль"
          type="password"
          required
        />
        <Button
          type="submit"
          className="h-[50px]"
          loading={form.formState.isSubmitting}
        >
          Сохранить
        </Button>
      </form>
    </FormProvider>
  );
};
