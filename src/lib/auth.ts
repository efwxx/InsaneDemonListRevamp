import { cache } from "react";
import { getServerSession } from "next-auth";
import clientPromise from "../../adapter";
import { ObjectId } from "mongodb";

export const getCurrentUser = cache(async () => {
  const session = await getServerSession();

  if (!session?.user?.email) {
    console.log("[getCurrentUser] No session or email found");
    return null;
  }

  console.log(
    `[getCurrentUser] Attempting to fetch user: ${session.user.email}`,
  );

  try {
    const client = await clientPromise;
    console.log("[getCurrentUser] MongoDB client promise resolved");

    const db = await client.connect();
    console.log("[getCurrentUser] Connected to MongoDB");

    const authDb = db.db("authentication");
    const user = await authDb
      .collection("users")
      .findOne({ email: session.user.email });

    if (user) {
      console.log(`[getCurrentUser] User found: ${user._id}`);
    } else {
      console.log(
        `[getCurrentUser] No user found for email: ${session.user.email}`,
      );
    }

    return user;
  } catch (error) {
    console.error("[getCurrentUser] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      name: error instanceof Error ? error.name : "Unknown",
      stack: error instanceof Error ? error.stack : undefined,
      email: session.user.email,
    });
    return null;
  }
});
