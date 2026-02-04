import { NextRequest, NextResponse } from "next/server";
import { middleware } from "../../middleware";
import clientPromise from "../../../../../adapter";
import jwt from "jsonwebtoken";
import { sendVerificationRequest } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, res: Record<any, any>) {
  let auth = await middleware(req);
  if (auth.error)
    return NextResponse.json(
      { error: auth.error, message: auth.message },
      { status: auth.status },
    );

  const userId = req.headers.get("user");
  if (!userId || !ObjectId.isValid(userId)) {
    return NextResponse.json(
      { error: "401 UNAUTHORIZED", message: "Invalid user ID." },
      { status: 401 },
    );
  }

  let db = await (await clientPromise).connect();
  let authDb = db.db("authentication");
  let exists = await authDb
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });
  if (!exists)
    return NextResponse.json(
      {
        error: "401 UNAUTHORIZED",
        message: "You are not authorized to use this route.",
      },
      { status: 401 },
    );
  exists.token = req.headers.get("authorization");
  return NextResponse.json({ user: exists });
}

export async function PATCH(req: NextRequest, res: Record<any, any>) {
  let auth = await middleware(req);
  if (auth.error)
    return NextResponse.json(
      { error: auth.error, message: auth.message },
      { status: auth.status },
    );

  const userId = req.headers.get("user");
  if (!userId || !ObjectId.isValid(userId)) {
    return NextResponse.json(
      { error: "401 UNAUTHORIZED", message: "Invalid user ID." },
      { status: 401 },
    );
  }

  let body: Record<any, any> = {};
  try {
    body = await req.json();
  } catch (_) {
    return NextResponse.json(
      { error: "400 BAD REQUEST", message: "Not a valid JSON body." },
      { status: 400 },
    );
  }

  let db = await (await clientPromise).connect();
  let authDb = db.db("authentication");
  let exists = await authDb
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });

  if (!exists)
    return NextResponse.json(
      {
        error: "401 UNAUTHORIZED",
        message: "You are not authorized to use this route.",
      },
      { status: 401 },
    );

  if (
    body.email &&
    body.email != exists.email &&
    typeof body.email === "string"
  ) {
    let valid =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
        body.email,
      );
    if (!valid)
      return NextResponse.json(
        {
          error: "400 BAD REQUEST",
          message: "This email is not a valid email!",
        },
        { status: 400 },
      );

    let existingEmail = await authDb
      .collection("users")
      .findOne({ email: body.email });
    if (existingEmail)
      return NextResponse.json(
        {
          error: "400 BAD REQUEST",
          message: "This email is already registered!",
        },
        { status: 400 },
      );

    let existingToken = await authDb
      .collection("tokens")
      .findOne({ userId: exists._id, type: "verify" });
    let token = crypto.randomUUID();
    if (!existingToken) {
      await authDb.collection("tokens").insertOne({
        token,
        userId: exists._id,
        createdAt: new Date(),
        type: "verify",
      });
    }

    await authDb.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          email: body.email,
        },
        $unset: {
          emailVerified: "",
        },
      },
    );

    await sendVerificationRequest({
      identifier: body.email,
      url: `${process.env.NEXT_PUBLIC_URL}/api/login/${existingToken ? existingToken.token : token}`,
      provider: {
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
        from: process.env.EMAIL_FROM,
      },
    });
  }

  if (body.name && body.name != exists.name && typeof body.name === "string") {
    await authDb.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          name: body.name,
        },
      },
    );
  }

  exists = await authDb
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });
  (exists as Record<any, any>).token = req.headers.get("authorization");
  return NextResponse.json(exists, { status: 201 });
}
