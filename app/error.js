"use client";

export default function Error({ error, reset }) {
  return (
    <main>
      <h1>Something went wrong</h1>
      <p>{error.message || "An unexpected error occurred."}</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
