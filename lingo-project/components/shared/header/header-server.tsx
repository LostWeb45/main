import { getServerSession } from "next-auth";
import { authOptions } from "@/constants/auth-options";
import { Header } from "./header";
import { TostsParamsClientWrapper } from "../tosts-clientwrapper";

export async function HeaderServer() {
  const session = await getServerSession(authOptions);

  return <Header initSession={session} />;
}
