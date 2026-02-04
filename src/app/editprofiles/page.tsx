import jwt from "jsonwebtoken";
import LeaderboardClient from "./client";
import NotFound from "../not-found";
import { getServerSession } from "next-auth";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
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

  let req1 = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/leaderboards?all=true`,
    { cache: "no-cache" },
  );
  let profiles = await req1.json();

  return (
    <main>
      <br></br>
      <LeaderboardClient
        profiles={profiles}
        authData={{ ...user, token }}
      ></LeaderboardClient>
    </main>
  );
}

export const revalidate = 0;
