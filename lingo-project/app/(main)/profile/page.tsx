import { ProfileForm } from "@/components/shared";
import { authOptions } from "@/constants/auth-options";
import { prisma } from "@/prisma/prisma-client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  console.log(session);

  if (!session) {
    return redirect("/");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: Number(session.user?.id),
    },
    include: {
      accounts: {
        select: {
          provider: true,
        },
      },
    },
  });

  if (!user) {
    return redirect("/");
  }

  return <ProfileForm data={user} />;
}
