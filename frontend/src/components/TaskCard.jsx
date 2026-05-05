import { CalendarDays, Trash2 } from 'lucide-react'
import { formatDate, isOverdue } from '../utils/helpers'

const badgeStyles = {
  todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  'in-progress': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
}

export default function TaskCard({
  task,
  isAdmin,
  canEdit,
  onStatusChange,
  onDelete,
}) {
  const overdue = isOverdue(task.deadline, task.status)

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{task.title}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${badgeStyles[task.status]}`}>
              {task.status.replace('-', ' ')}
            </span>
            {overdue ? (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
                Overdue
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{task.description || 'No description provided.'}</p>
        </div>

        {isAdmin ? (
          <button
            type="button"
            onClick={() => onDelete(task._id)}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-200"
          >
            <Trash2 size={18} />
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
          <p className="font-medium text-slate-700 dark:text-slate-200">
            Assigned to: {task.assignedTo?.name || 'Unknown user'}
          </p>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            <span>{formatDate(task.deadline)}</span>
          </div>
        </div>

        <select
          value={task.status}
          disabled={!canEdit}
          onChange={(event) => onStatusChange(task._id, event.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </article>
  )
}
