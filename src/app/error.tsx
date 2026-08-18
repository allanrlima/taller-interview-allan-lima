"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <main className="shell">
      <div role="alert" className="status">
        <h1>Something went wrong</h1>
        <button type="button" onClick={reset}>Try again</button>
      </div>
    </main>
  );
}
