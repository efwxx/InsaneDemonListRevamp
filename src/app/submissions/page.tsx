import { getServerSession } from "next-auth";
import NotFound from "../not-found";
import Submissions from "./client";
import { getCurrentUser } from "@/lib/auth";
import jwt from "jsonwebtoken";

export default async function RootLayout() {
  const session = await getServerSession();
  const user = await getCurrentUser();

  if (!user?.perms?.idl) {
    return <NotFound></NotFound>;
  }

  const token = session?.user?.email
    ? jwt.sign(
        { id: session.user.email as string },
        process.env.NEXTAUTH_SECRET as string,
      )
    : "";

  let [req1, req2] = await Promise.all([
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboards?all=true`),
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admins/submissions`, {
      headers: {
        authorization: token,
      },
    }),
  ]);

  let [leaderboards, submissions] = await Promise.all([
    await req1.json(),
    await req2.json(),
  ]);

  return (
    <>
      <br></br>
      <Submissions
        submissions={submissions}
        authData={{ ...user, token }}
        leaderboards={leaderboards}
      ></Submissions>
    </>
  );
}

export const revalidate = 0;
