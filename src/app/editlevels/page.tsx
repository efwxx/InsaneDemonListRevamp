import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";
import NotFound from "../not-found";
import EditLevels from "./client";
import { getCurrentUser } from "@/lib/auth";

export default async function RootLayout() {
  const session = await getServerSession();
  const user = await getCurrentUser();

  if ((user?.perms?.idl || 0) < 1) {
    return <NotFound></NotFound>;
  }

  const token = session?.user?.email
    ? jwt.sign(
        { id: session.user.email as string },
        process.env.NEXTAUTH_SECRET as string,
      )
    : "";
  let [req1] = await Promise.all([
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboards?all=true`),
  ]);

  let [leaderboards] = await Promise.all([await req1.json()]);

  return (
    <EditLevels
      authData={{ ...user, token }}
      leaderboards={leaderboards}
    ></EditLevels>
  );
}

export const revalidate = 0;
