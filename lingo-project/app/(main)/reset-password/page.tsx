"use client";

import { Container, Title } from "@/components/shared";
import { ResetPasswordForm } from "@/components/shared/modals/auth-modal/forms/reset-password-form";
import { Suspense } from "react";

const ResetPasswordPage = () => {
  return (
    <Container className="flex justify-center">
      <div className="w-full max-w-lg bg-white shadow-sm rounded-[3px] p-8 border border-gray-100">
        <div className="text-center mb-6">
          <Title text="Сброс пароля" className="font-medium text-[26px]" />
          <div className="w-[240px] h-[3px] bg-gray-300 mx-auto mt-3 rounded-full" />
        </div>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </Container>
  );
};

export default ResetPasswordPage;
