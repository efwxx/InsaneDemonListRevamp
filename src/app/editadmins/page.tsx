import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";
import NotFound from "../not-found";
import { Flex, Text, Box, Grid } from "@radix-ui/themes";
import Image from "next/image";
import Admin from "@/components/Admin";
import EditAdmins from "./client";
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
  let req2 = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users`, {
    headers: {
      authorization: token,
    },
  });
  let users = await req2.json();

  if (!Array.isArray(users)) {
    return <NotFound></NotFound>;
  }

  return (
    <EditAdmins
      authData={{ user: { ...user, token } }}
      users={users}
    ></EditAdmins>
  );
}
