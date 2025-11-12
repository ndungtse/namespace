import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
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

  const rootDomain = process.env.ROOT_DOMAIN || "localhost";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const subdomainUrl = `${protocol}://${user.username}.${rootDomain}`;

  return <DashboardClient user={user} subdomainUrl={subdomainUrl} />;
}

