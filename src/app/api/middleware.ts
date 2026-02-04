import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import clientPromise from "../../../adapter";
import cache from "../../../cache.json";
import { ObjectId } from "mongodb";

// This function can be marked `async` if using `await` inside
type permissions = "helper" | "moderator" | "leader";
const perms_array = cache.perms;
export async function middleware(request: NextRequest, perms?: permissions) {
  let auth = request.headers.get("authorization");
  try {
    let payload = jwt.verify(
      auth as string,
      process.env.NEXTAUTH_SECRET as string,
    ) as Record<any, any>;
    if (!payload.id) throw new Error();

    let db = await (await clientPromise).connect();
    let authDb = db.db("authentication");
    let user = await authDb.collection("users").findOne({ email: payload.id });

    if (!user)
      return {
        error: "401 UNAUTHORIZED",
        message: "User not found.",
        status: 401,
      };

    if (perms) {
      if ((user.perms.idl || 0) < perms_array.indexOf(perms) + 1)
        return {
          error: "401 UNAUTHORIZED",
          message: "You are not authorized to use this route.",
          status: 401,
        };
      request.headers.set("full_user", JSON.stringify(user));
    }
    request.headers.set("user", user._id.toString());
    return {};
  } catch (_) {
    return {
      error: "401 UNAUTHORIZED",
      message: "You are not authorized to use this route.",
      status: 401,
    };
  }
}
