import { getServerSession } from "next-auth";
import NotFound from "../not-found";
import Packs from "./client";
import jwt from "jsonwebtoken";
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

  return (
    <>
      <br></br>
      <Packs authData={{ ...user, token }}></Packs>
    </>
  );
}

export const revalidate = 0;
