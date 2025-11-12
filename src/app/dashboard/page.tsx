import { db } from "@/db";
import { users } from "@/db/schema";
import { getSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!user) {
    redirect("/login");
  }

  return <DashboardClient user={user}  />;
}

