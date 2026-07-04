import Link from "next/link";

export default function NotFound() {
  return (
    <main className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase text-zinc-500">404</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          Page Not Found
        </h1>
        <p className="text-sm leading-6 text-zinc-600">
          The page you are looking for does not exist.
        </p>
        <Link
          className="inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          href="/"
        >
          Back to post list
        </Link>
      </div>
    </main>
  );
}
