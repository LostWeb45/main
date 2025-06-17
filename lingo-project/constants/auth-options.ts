import YandexProvider from "next-auth/providers/yandex";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/prisma-client";
import { compare } from "bcryptjs";
import { YandexProfile } from "next-auth/providers/yandex";
import { NextAuthOptions, DefaultSession } from "next-auth";
import { Prisma } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      image?: string;
      role?: string;
      email?: string;
      provider?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    picture?: string;
    role?: string;
    email?: string;
    provider?: string;
  }
}

type UserWithAccounts = Prisma.UserGetPayload<{ include: { accounts: true } }>;

export const authOptions: NextAuthOptions = {
  providers: [
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "login:email login:info login:avatar",
        },
      },
      profile(profile: YandexProfile) {
        return {
          id: profile.login,
          name: profile.display_name || profile.real_name || profile.login,
          email: profile.default_email,
          image: `https://avatars.yandex.net/get-yapic/${profile.default_avatar_id}/islands-200`,
          role: "ORGANIZER",
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "ORGANIZER",
        };
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await compare(
          credentials.password.trim(),
          user.password.trim()
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Credentials
      if (account?.provider === "credentials") {
        const findUser = await prisma.user.findFirst({
          where: { email: token.email as string },
        });

        if (findUser) {
          token.id = String(findUser.id);
          token.email = findUser.email;
          token.role = findUser.role;
          token.name = findUser.name;
          token.provider = account.provider;
          token.image = findUser.image;
        }
      }

      // Yandex
      if (account?.provider === "yandex" && profile) {
        const yandexProfile = profile as YandexProfile;

        if (account.provider && account.providerAccountId) {
          let user = await prisma.user.findFirst({
            where: {
              accounts: {
                some: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
            },
            include: { accounts: true },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email: yandexProfile.default_email as string,
                name:
                  yandexProfile.display_name ||
                  yandexProfile.real_name ||
                  yandexProfile.login,
                image: `https://avatars.yandex.net/get-yapic/${yandexProfile.default_avatar_id}/islands-200`,
                role: "ORGANIZER",
                password: "",
                emailVerified: new Date(),
                accounts: {
                  create: {
                    type: "OAUTH",
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token ?? undefined,
                    refresh_token: account.refresh_token ?? undefined,
                    scope: account.scope ?? undefined,
                    token_type: account.token_type ?? undefined,
                    session_state: account.session_state ?? undefined,
                  },
                },
              },
              include: { accounts: true },
            });
          } else {
            await prisma.account.updateMany({
              where: {
                userId: user.id,
                provider: account.provider,
              },
              data: {
                providerAccountId: account.providerAccountId,
                access_token: account.access_token ?? undefined,
                refresh_token: account.refresh_token ?? undefined,
                scope: account.scope ?? undefined,
                token_type: account.token_type ?? undefined,
                session_state: account.session_state ?? undefined,
              },
            });
          }

          token.id = String(user.id);
          token.name = user.name;
          token.email = user.email;
          token.image = user.image ?? undefined;
          token.role = user.role;
          token.provider = account.provider;
        }
      }

      if (account?.provider === "google" && profile) {
        if (account.provider && account.providerAccountId) {
          let user = await prisma.user.findFirst({
            where: {
              accounts: {
                some: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
            },
            include: { accounts: true },
          });

          if (!user) {
            user = await prisma.user.findUnique({
              where: { email: profile.email },
              include: { accounts: true },
            });

            if (!user) {
              user = (await prisma.user.create({
                data: {
                  email: profile.email || "",
                  name: profile.name || "",
                  image: profile.picture,
                  role: "ORGANIZER",
                  password: "",
                  emailVerified: new Date(),
                  accounts: {
                    create: {
                      type: "OAUTH",
                      provider: account.provider,
                      providerAccountId: account.providerAccountId,
                      access_token: account.access_token ?? undefined,
                      refresh_token: account.refresh_token ?? undefined,
                      scope: account.scope ?? undefined,
                      token_type: account.token_type ?? undefined,
                      session_state: account.session_state ?? undefined,
                    },
                  },
                },
                include: { accounts: true },
              })) as UserWithAccounts;
            } else {
              const existingAccount = user.accounts.find(
                (acc) => acc.provider === account.provider
              );

              if (!existingAccount) {
                await prisma.account.create({
                  data: {
                    userId: user.id,
                    type: "OAUTH",
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token ?? undefined,
                    refresh_token: account.refresh_token ?? undefined,
                    scope: account.scope ?? undefined,
                    token_type: account.token_type ?? undefined,
                    session_state: account.session_state ?? undefined,
                  },
                });
              } else {
                await prisma.account.updateMany({
                  where: {
                    userId: user.id,
                    provider: account.provider,
                  },
                  data: {
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token ?? undefined,
                    refresh_token: account.refresh_token ?? undefined,
                    scope: account.scope ?? undefined,
                    token_type: account.token_type ?? undefined,
                    session_state: account.session_state ?? undefined,
                  },
                });
              }
            }
          }

          token.id = String(user.id);
          token.name = user.name;
          token.email = user.email;
          token.image = user.image ?? undefined;
          token.role = user.role;
          token.provider = account.provider;
        }
      }

      // Обновляем токен из базы, если нужно
      if (token.id) {
        const updatedUser = await prisma.user.findUnique({
          where: { id: Number(token.id) },
        });

        if (updatedUser) {
          token.name = updatedUser.name;
          token.email = updatedUser.email;
          token.image = updatedUser.image;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
};
