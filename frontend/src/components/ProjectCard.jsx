import { ArrowRight, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Project</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{project.name}</h3>
        </div>
        <div className="rounded-2xl bg-brand-50 p-3 text-brand-600 dark:bg-brand-500/10 dark:text-brand-200">
          <Users size={20} />
        </div>
      </div>

      <p className="mt-4 min-h-12 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {project.description || 'No description yet.'}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
        <div>
          <p className="font-medium text-slate-700 dark:text-slate-200">{project.members?.length || 0} members</p>
          <p className="text-slate-500 dark:text-slate-400">Owner: {project.createdBy?.name}</p>
        </div>

        <Link
          to={`/projects/${project._id}`}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 font-medium text-white transition group-hover:bg-brand-500 dark:bg-white dark:text-slate-900"
        >
          Open
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  )
}
