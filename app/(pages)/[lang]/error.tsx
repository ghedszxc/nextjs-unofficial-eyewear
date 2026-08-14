"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-neutral-600">
        We couldn&apos;t load this page right now. Please try again in a moment.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-full border border-black px-6 py-2 transition-colors hover:bg-black hover:text-white"
      >
        Try again
      </button>
    </main>
  );
}
