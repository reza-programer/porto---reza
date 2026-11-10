/** The admin keeps its own plain loader instead of the public one. */
export default function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <span className="t-small animate-pulse text-muted">Memuat…</span>
    </div>
  );
}
