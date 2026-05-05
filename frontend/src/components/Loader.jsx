export default function Loader({ label = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
      <span className="size-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      <span>{label}</span>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/80 px-4 dark:bg-slate-950">
        {content}
      </div>
    )
  }

  return <div className="flex justify-center py-8">{content}</div>
}
