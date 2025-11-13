'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/db/schema";
import { getHomepageUrl } from "@/lib/subdomain";
import Link from "next/link";

interface ProfileClientProps {
  user: User;
  joinDate: string;
}

export default function ProfileClient({ user, joinDate }: ProfileClientProps) {
  const homepageUrl = getHomepageUrl();

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Link
            href={homepageUrl ?? "/s"}
            className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8"
          >
            ← Back to home
          </Link>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
            <div className="flex items-start gap-6 mb-6">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={user.avatarUrl || undefined}
                  alt={user.displayName || user.username}
                  className="object-cover"
                />
                <AvatarFallback className="w-24 h-24 text-2xl font-semibold bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 flex items-center justify-center">
                  {(user.displayName || user.username)[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  {user.displayName || user.username}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  @{user.username}
                </p>
                {user.bio && (
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Joined {joinDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

