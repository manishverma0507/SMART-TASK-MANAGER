import { FolderKanban, LayoutDashboard, ListChecks } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { classNames } from '../utils/helpers'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 rounded-[28px] border border-white/70 bg-slate-950 px-5 py-6 text-white shadow-xl shadow-slate-900/20 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-100">
          <ListChecks size={24} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Workspace</p>
          <h2 className="text-lg font-semibold">Team Task Manager</h2>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              classNames(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white',
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        <p className="font-semibold text-white">Built for focused teams</p>
        <p className="mt-2 leading-6 text-slate-400">
          Track work, assign ownership, and keep every project visible in one place.
        </p>
      </div>
    </aside>
  )
}
