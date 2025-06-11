"use server";

import { VerificationUserTemplate } from "@/components/shared/email-templates/verification-user";
import { sendMail } from "@/lib/sendMail";
import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { hashSync } from "bcryptjs";

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error("Пользователь не найден");
    }

    const userAccount = await prisma.account.findFirst({
      where: {
        userId: Number(currentUser.id),
        type: "OAUTH",
      },
    });

    const isOAuthUser = userAccount?.provider === "yandex";

    const currentUserData = await prisma.user.findUnique({
      where: {
        id: Number(currentUser.id),
      },
    });

    if (!currentUserData) {
      throw new Error("Пользователь не найден");
    }

    const emailChanged =
      !isOAuthUser && body.email && body.email !== currentUserData.email;

    await prisma.user.update({
      where: {
        id: Number(currentUser.id),
      },
      data: {
        name: body.name,
        email: isOAuthUser ? undefined : body.email,
        password:
          isOAuthUser || !body.password
            ? undefined
            : hashSync(body.password as string, 10),
        emailVerified: emailChanged ? null : currentUserData.emailVerified,
      },
    });
  } catch (err) {
    console.log("Error [UPDATE_USER]", err);
    throw err;
  }
}

export async function registerUser(body: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user) {
      if (!user.emailVerified) {
        throw new Error("Почта не подтверждена");
      }

      throw new Error("Пользователь с такой почтой уже зарегистрирован");
    }

    const createUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashSync(body.password as string, 10),
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Error [REGISTER_USER]", err);
      throw new Error(err.message);
    }

    console.log("Error [REGISTER_USER]", err);
    throw new Error("Неизвестная ошибка при регистрации");
  }
}

export async function requestEmailVerification() {
  const currentUser = await getUserSession();

  if (!currentUser) {
    return false;
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.verificationCode.deleteMany({
    where: {
      userId: Number(currentUser.id),
    },
  });

  await prisma.verificationCode.create({
    data: {
      code,
      userId: Number(currentUser.id),
    },
  });

  const emailHtml = VerificationUserTemplate({ code });

  await sendMail({
    to: currentUser.email!,
    subject: "LinGo | Подтверждение почты",
    text: `Ваш код подтверждения: ${code}`,
    html: emailHtml,
  });

  return true;
}
