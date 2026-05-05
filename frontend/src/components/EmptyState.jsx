import { Inbox } from 'lucide-react'

export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 px-6 py-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-100">
        <Inbox size={26} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
