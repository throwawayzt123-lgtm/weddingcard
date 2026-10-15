export default function Loading() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Loading">
      <div className="h-9 w-56 rounded-lg bg-ink/10" />
      <div className="h-4 w-80 max-w-full rounded bg-ink/10" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="h-32 rounded-2xl bg-ink/10" />
        <div className="h-32 rounded-2xl bg-ink/10" />
      </div>
      <div className="h-48 rounded-2xl bg-ink/10" />
    </div>
  );
}
