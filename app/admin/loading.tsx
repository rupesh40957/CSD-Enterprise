export default function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-navy-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Loading CSD Operations Portal...
        </span>
      </div>
    </div>
  );
}
