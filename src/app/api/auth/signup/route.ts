import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { signupSchema } from "@/lib/validations";
import { eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = signupSchema.parse(body);

    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.username, validated.username), eq(users.email, validated.email)))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(validated.password);

    const [newUser] = await db
      .insert(users)
      .values({
        username: validated.username,
        email: validated.email,
        password: hashedPassword,
        displayName: validated.displayName,
      })
      .returning();

    await createSession({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    });

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          displayName: newUser.displayName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

