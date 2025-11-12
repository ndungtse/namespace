import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          404
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8">
          Profile not found
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Go to home
        </Link>
      </div>
    </div>
  );
}

