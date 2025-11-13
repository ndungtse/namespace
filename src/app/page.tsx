import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSubdomainUrl } from "@/lib/subdomain";

export default async function Home() {
  const session = await getSession();
  let user = null;

  if (session) {
    const [userData] = await db
      .select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);
    user = userData;
  }

  const subdomainUrl = getSubdomainUrl(user?.username || "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
            Your Own Subdomain Profile
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
            Sign up and get your unique subdomain profile page.
            <br />
            Share your profile at <code className="px-2 py-1 bg-zinc-200 dark:bg-zinc-700 rounded text-sm">username.{process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost"}</code>
          </p>

          {user ? (
            <div className="space-y-4">
              <p className="text-lg text-zinc-700 dark:text-zinc-300">
                Welcome back, {user.displayName || user.username}!
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={subdomainUrl} target="_blank">
                    View Profile
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          )}

          <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Unique Subdomain
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Each user gets their own subdomain for a personalized profile URL.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Customizable Profile
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Edit your display name, bio, and avatar to make it your own.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Easy to Use
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Simple signup process and intuitive dashboard for managing your profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
