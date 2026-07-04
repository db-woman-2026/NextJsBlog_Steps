"use client";

export default function Error({ error, reset }) {
  return (
    <main className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase text-red-600">Error</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          Something went wrong
        </h1>
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          type="button"
          onClick={reset}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
